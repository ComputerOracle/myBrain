import os
import urllib.request
import xml.etree.ElementTree as ET
from types import SimpleNamespace
import nibabel as nib
from nilearn import datasets
from skimage import measure
import trimesh


def fetch_atlas_cerebellar(data_dir: str | None = None) -> SimpleNamespace:
    """Fetch the FSL Cerebellar atlas (MNI152 1mm space).

    Downloads the atlas files if not present and returns a namespace
    with .maps (canonical Nifti1Image) and .labels list.
    """
    if data_dir is None:
        home_dir = os.path.expanduser("~")
        data_dir = os.path.join(home_dir, "nilearn_data", "fsl", "data", "atlases")

    cereb_dir = os.path.join(data_dir, "Cerebellum")
    os.makedirs(cereb_dir, exist_ok=True)

    nii_path = os.path.join(cereb_dir, "Cerebellum-MNIfnirt-maxprob-thr25-1mm.nii.gz")
    xml_path = os.path.join(data_dir, "Cerebellum_MNIfnirt.xml")

    base_url = "https://raw.githubusercontent.com/dmascali/mni2atlas/master/atlases"
    if not os.path.exists(nii_path):
        print("Downloading Cerebellar atlas map...")
        urllib.request.urlretrieve(f"{base_url}/Cerebellum/Cerebellum-MNIfnirt-maxprob-thr25-1mm.nii.gz", nii_path)

    if not os.path.exists(xml_path):
        print("Downloading Cerebellar atlas labels...")
        urllib.request.urlretrieve(f"{base_url}/Cerebellum_MNIfnirt.xml", xml_path)

    img = nib.load(nii_path)
    canonical_img = nib.as_closest_canonical(img)

    tree = ET.parse(xml_path)
    labels = ["Background"] + [elem.text for elem in tree.findall(".//data/label")]

    return SimpleNamespace(maps=canonical_img, labels=labels)


# Ensure fetch_atlas_cerebellar is available in nilearn.datasets
if not hasattr(datasets, "fetch_atlas_cerebellar"):
    datasets.fetch_atlas_cerebellar = fetch_atlas_cerebellar


def process_atlas(voxel_data, labels, scene: trimesh.Scene) -> None:
    """Process an atlas's 3D voxel data and labels, extracting and smoothing meshes."""
    for region_id, label in enumerate(labels):
        if region_id == 0:
            continue

        mask = voxel_data == region_id
        if not mask.any():
            continue

        verts, faces, _, _ = measure.marching_cubes(mask, level=0.5)
        mesh = trimesh.Trimesh(vertices=verts, faces=faces)
        trimesh.smoothing.filter_taubin(mesh)

        region_name = label.replace(" ", "_")
        mesh.metadata["name"] = region_name
        scene.add_geometry(mesh, node_name=region_name, geom_name=region_name)


def generate_full_brain_model(output_path: str | None = None) -> None:
    """Generate a combined 3D brain model from cortical, subcortical, and cerebellar atlases."""
    if output_path is None:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, "brain-app", "public", "full_brain_model.glb")

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    print("Fetching atlases from nilearn.datasets...")
    cortical_atlas = datasets.fetch_atlas_harvard_oxford("cort-maxprob-thr25-1mm")
    subcortical_atlas = datasets.fetch_atlas_harvard_oxford("sub-maxprob-thr25-1mm")
    cerebellar_atlas = datasets.fetch_atlas_cerebellar()

    # Create a single trimesh.Scene
    scene = trimesh.Scene()

    print("Processing cortical data...")
    process_atlas(cortical_atlas.maps.get_fdata(), cortical_atlas.labels, scene)
    print(f"  Total scene meshes after cortical: {len(scene.geometry)}")

    print("Processing subcortical data...")
    process_atlas(subcortical_atlas.maps.get_fdata(), subcortical_atlas.labels, scene)
    print(f"  Total scene meshes after subcortical: {len(scene.geometry)}")

    print("Processing cerebellar data...")
    process_atlas(cerebellar_atlas.maps.get_fdata(), cerebellar_atlas.labels, scene)
    print(f"  Total scene meshes after cerebellar: {len(scene.geometry)}")

    print(f"Exporting combined scene to '{output_path}'...")
    scene.export(output_path)
    print(f"Done! Successfully exported '{output_path}' ({os.path.getsize(output_path)} bytes).")


if __name__ == "__main__":
    generate_full_brain_model()
