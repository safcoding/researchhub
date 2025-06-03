//WILL NEED TO CHANGE VARIABLE NAMES TO MATCH ABRAR'S FILE I THINK
export type Lab = {
  id: number;
  name: string;
  labHead: string;
  department: string;
  researchArea: string;
  location: string;
  description: string;
  equipment: { id: number; name: string }[];
  staff: { id: number; name: string }[];
  researchers: { id: number; name: string }[];
  publications?: string[];
};


//RANDOM LAB DATA, CHANGE TO IKOZHA LABS LATER\0

export const labsData: Lab[] = [
  {
    id: 1,
    name: 'Nanomaterials Research Lab',
    labHead: 'Dr. Sarah Chen',
    department: 'Materials Science',
    researchArea: 'Nanostructured Materials, Composites',
    location: 'Engineering Building, Room 205',
    description: 'Focuses on developing advanced nanomaterials for energy applications',
    equipment: [
      { id: 1, name: 'Scanning Electron Microscope (SEM)' },
      { id: 2, name: 'X-ray Diffractometer (XRD)' },
      { id: 3, name: 'Fourier Transform Infrared Spectrometer (FTIR)' }
    ],
    staff: [
      { id: 1, name: 'Dr. Sarah Chen (Lab Head)' },
      { id: 2, name: 'Prof. Michael Johnson' }
    ],
    researchers: [
      { id: 1, name: 'Ahmad bin Ali (PhD Candidate)' },
      { id: 2, name: 'Lisa Tan (MSc Researcher)' }
    ],
    publications: [
      'Chen et al. (2023) Advanced Materials',
      'Zhang et al. (2022) Nano Letters'
    ]
  },
  {
    id: 2,
    name: 'Polymer Science Lab',
    labHead: 'Dr. Emily Wong',
    department: 'Materials Science',
    researchArea: 'Sustainable Polymers, Biomaterials',
    location: 'Engineering Building, Room 310',
    description: 'Developing next-generation biodegradable polymers for medical applications',
    equipment: [
      { id: 1, name: 'Gel Permeation Chromatography (GPC)' },
      { id: 2, name: 'Differential Scanning Calorimeter (DSC)' },
      { id: 3, name: 'Rheometer' }
    ],
    staff: [
      { id: 1, name: 'Dr. Emily Wong (Lab Head)' },
      { id: 2, name: 'Dr. Robert Kim' }
    ],
    researchers: [
      { id: 1, name: 'Fatimah Ahmed (PhD Candidate)' },
      { id: 2, name: 'James Wilson (Postdoc)' }
    ],
    publications: [
      'Wong et al. (2023) Polymer Chemistry',
      'Kim et al. (2022) Biomaterials Science'
    ]
  },
  {
    id: 3,
    name: 'AI Research Lab',
    labHead: 'Dr. Alan Turing',
    department: 'Computer Science',
    researchArea: 'Machine Learning, Computer Vision',
    location: 'CS Building, Room 101',
    description: 'Pioneering research in deep learning architectures and applications',
    equipment: [
      { id: 1, name: 'GPU Cluster (NVIDIA A100)' },
      { id: 2, name: 'VR Development Setup' }
    ],
    staff: [
      { id: 1, name: 'Dr. Alan Turing (Lab Head)' },
      { id: 2, name: 'Dr. Ada Lovelace' }
    ],
    researchers: [
      { id: 1, name: 'Mohammad Khan (PhD Candidate)' },
      { id: 2, name: 'Sophia Garcia (MSc Researcher)' }
    ],
    publications: [
      'Turing et al. (2023) NeurIPS',
      'Lovelace et al. (2022) CVPR'
    ]
  },
  {
    id: 4,
    name: 'Cybersecurity Lab',
    labHead: 'Dr. Grace Hopper',
    department: 'Computer Science',
    researchArea: 'Network Security, Cryptography',
    location: 'CS Building, Room 205',
    description: 'Developing secure systems and cryptographic protocols',
    equipment: [
      { id: 1, name: 'Network Security Testbed' },
      { id: 2, name: 'Quantum Computing Simulator' }
    ],
    staff: [
      { id: 1, name: 'Dr. Grace Hopper (Lab Head)' },
      { id: 2, name: 'Dr. Tim Berners-Lee' }
    ],
    researchers: [
      { id: 1, name: 'Daniel Park (PhD Candidate)' },
      { id: 2, name: 'Aisha Mohammed (MSc Researcher)' }
    ],
    publications: [
      'Hopper et al. (2023) IEEE Security & Privacy',
      'Berners-Lee et al. (2022) Crypto'
    ]
  },
  {
    id: 5,
    name: 'Genomics Lab',
    labHead: 'Dr. Maria Garcia',
    department: 'Biotechnology',
    researchArea: 'CRISPR, Gene Editing',
    location: 'Biology Building, Room 420',
    description: 'Cutting-edge research in genetic engineering and genome analysis',
    equipment: [
      { id: 1, name: 'Next-Gen Sequencer' },
      { id: 2, name: 'PCR Machines' },
      { id: 3, name: 'Microarray Scanner' }
    ],
    staff: [
      { id: 1, name: 'Dr. Maria Garcia (Lab Head)' },
      { id: 2, name: 'Dr. James Watson' }
    ],
    researchers: [
      { id: 1, name: 'Olivia Smith (PhD Candidate)' },
      { id: 2, name: 'Noah Johnson (Research Assistant)' }
    ],
    publications: [
      'Garcia et al. (2023) Nature Biotechnology',
      'Watson et al. (2022) Cell'
    ]
  },
  {
    id: 6,
    name: 'Biomedical Engineering Lab',
    labHead: 'Dr. Lisa Zhang',
    department: 'Biotechnology',
    researchArea: 'Prosthetics, Medical Devices',
    location: 'Medical Sciences Building, Room 315',
    description: 'Developing advanced medical devices and rehabilitation technologies',
    equipment: [
      { id: 1, name: '3D Bioprinter' },
      { id: 2, name: 'Motion Capture System' },
      { id: 3, name: 'EMG Measurement System' }
    ],
    staff: [
      { id: 1, name: 'Dr. Lisa Zhang (Lab Head)' },
      { id: 2, name: 'Dr. Sanjay Gupta' }
    ],
    researchers: [
      { id: 1, name: 'Emma Wilson (PhD Candidate)' },
      { id: 2, name: 'Liam Brown (MSc Researcher)' }
    ],
    publications: [
      'Zhang et al. (2023) Science Robotics',
      'Gupta et al. (2022) IEEE Transactions on Biomedical Engineering'
    ]
  }
];