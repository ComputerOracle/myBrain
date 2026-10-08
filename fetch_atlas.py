from nilearn import datasets

# 1. Fetch the Harvard-Oxford atlas
atlas = datasets.fetch_atlas_harvard_oxford('sub-maxprob-thr25-1mm')

# 2. Extract the 3D volume data directly
brain_data = atlas.maps.get_fdata()

# 3. Print the list of brain regions
for index, part_name in enumerate(atlas.labels):
    print(f"ID {index}: {part_name}")