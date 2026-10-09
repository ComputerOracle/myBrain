# 3D Neuroscience Explorer

An interactive, educational 3D web platform for exploring human neuroanatomy. Built with React Three Fiber, this application allows users to seamlessly transition from a macroscopic view of the cerebral cortex to an advanced view of deep subcortical structures.

## 🧠 Features

* **Interactive 3D Anatomy:** Features 97 distinct brain regions extracted from the Harvard-Oxford (cortical/subcortical) and MNI cerebellar atlases.
* **Staged Learning Modes:**
  * **Macro Overview:** High-level functional groupings of the 4 major lobes, cerebellum, and brainstem.
  * **Lobe Focus:** Isolated inspection of specific gyri and cortices with detailed functional descriptions.
  * **Deep Core:** A glass-shell transition that reveals the limbic system, basal ganglia, and ventricles floating within a frosted cerebrum silhouette.
* **Cinematic Rendering:** Utilizes `@react-three/postprocessing` for Screen Space Ambient Occlusion (SSAO), bloom, multi-sampling, and a professional 3-point studio lighting setup to mimic realistic organic tissue.

## 🛠 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS
* **3D Engine:** Three.js, React Three Fiber (R3F), Drei
* **Data Pipeline:** Python, `nilearn`, `trimesh`, `skimage` (for converting MRI voxel data into smoothed marching-cube meshes)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python 3.10+ (for generating/updating the 3D model)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ComputerOracle/3D-Neuroscience-Explorer.git
   cd 3D-Neuroscience-Explorer
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📊 Data Pipeline (Optional)
To regenerate the `.glb` model from raw MRI data:
1. Navigate to the pipeline directory.
2. Install python dependencies: `pip install nilearn trimesh scikit-image nibabel`.
3. Run `python generate_brain_model.py`.

## 👨‍💻 Author
**Chibuikem Madugba**
