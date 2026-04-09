A
Project Report
On

SYNAPSE – AI Model Marketplace & Runtime Orchestration Platform

Developed at

(Company / Organization Name)

Developed by
(YOUR NAME) – Department of IT, DD University

Guided By

Internal Guide:
(Internal Guide Name)
Department of Information Technology
Faculty of Technology
DD University

External Guide:
(External Guide Name)
(Designation)
(Company / Organization)
(City)

Department of Information Technology
Faculty of Technology, Dharmsinh Desai University
College Road, Nadiad-387001
March-2026

CANDIDATE'S DECLARATION

I declare that the final semester report entitled "Synapse – AI Model Marketplace & Runtime Orchestration Platform" is my own work conducted under the supervision of the external guide (External Guide Name) from (Company / Organization).
I further declare that to the best of my knowledge the report for B.Tech. final semester does not contain part of the work which has been submitted for the award of B.Tech. Degree either in this or any other university without proper citation.

Candidate's Signature:

Candidate's Name: (Your Name)
Branch: IT
Student ID: (Your ID)

DHARMSINH DESAI UNIVERSITY
NADIAD-387001, GUJARAT

CERTIFICATE

This is to certify that the project entitled "Synapse – AI Model Marketplace & Runtime Orchestration Platform" is a bonafide report of the work carried out by Mr./Ms. (Your Name), Student ID No: (Your ID) of Department of Information Technology, semester VIII, under the guidance and supervision for the award of the degree of Bachelor of Technology at Dharmsinh Desai University, Nadiad (Gujarat). He/She was involved in Project training during the academic year 2025-2026.

(Internal Guide Name)
(Project Guide)
Department of Information Technology,
Faculty of Technology,
Dharmsinh Desai University, Nadiad
Date:

Prof. (Dr.) V. K. Dabhi
Head, Department of Information Technology,
Faculty of Technology,
Dharmsinh Desai University, Nadiad
Date:

ACKNOWLEDGEMENT

The success and final outcome of this project required guidance from many people, and I am fortunate to have received consistent support throughout the completion of my work. Whatever I have accomplished is due to this guidance and assistance, and I will always be grateful for it.

I feel very fortunate to have had the opportunity to pursue my Bachelor of Technology (Information Technology) at DDU, and to complete the project "Synapse – AI Model Marketplace & Runtime Orchestration Platform" as part of my final semester internship training.

I sincerely thank Prof. (Dr.) V. K. Dabhi (Head, Department of Information Technology) and (Internal Guide Name) for their constructive thoughts and vision, which contributed to the successful completion of this project. I am also highly grateful to (External Guide Name) for kind support, encouragement, and motivation throughout this challenging task.

My heartfelt appreciation goes to my colleagues who provided valuable insights during the development of this project. Lastly, I express my deep gratitude to my family members and friends, who have been a constant source of inspiration and support throughout this journey.

With sincere regards,
(Your Name)

TABLE OF CONTENT

ABSTRACT	i
COMPANY PROFILE	ii
LIST OF FIGURES	iii
LIST OF TABLES	iv
CHAPTER 0: TRAINING TAKEN AT INDUSTRY	1
CHAPTER 1: INTRODUCTION	3
   1.1 Project Details	3
   1.2 Purpose	3
   1.3 Scope	4
   1.4 Objective	4
   1.5 Technology	5
CHAPTER 2: PROJECT MANAGEMENT	6
   2.1 Feasibility Study	6
      2.1.1 Technical Feasibility	6
      2.1.2 Time Schedule Feasibility	6
      2.1.3 Operational Feasibility	6
      2.1.4 Implementation Feasibility	7
   2.2 Project Planning	7
      2.2.1 Project Development Approach and Justification	7
      2.2.2 Group Dependencies	9
      2.2.3 Project Scheduling	9
CHAPTER 3: SYSTEM REQUIREMENTS STUDY	11
   3.1 Study of Current System	11
   3.2 Problems and Weaknesses of Current System	11
   3.3 User Characteristics	12
   3.4 Hardware and Software Requirements	13
   3.5 Constraints	13
      3.5.1 Hardware Limitations	13
      3.5.2 Reliability Requirements	14
   3.6 Assumptions and Dependencies	14
CHAPTER 4: SYSTEM ANALYSIS	15
   4.1 Requirements of New System	15
      4.1.1 Functional Requirements	15
      4.1.2 Non-Functional Requirements	17
   4.2 Use-Case Diagram	18
   4.3 Class Diagram	19
   4.4 Flow Chart	20
CHAPTER 5: SYSTEM DESIGN	21
   5.1 System Architecture	21
   5.2 AWS Deployment Architecture	22
   5.3 Dataflow Diagram	23
CHAPTER 6: IMPLEMENTATION PLANNING	25
   6.1 Implementation Environment	25
   6.2 Program/Module Specification	26
   6.3 Coding Standards	29
CHAPTER 7: TESTING	30
   7.1 Testing Plan	30
   7.2 Testing Strategy	30
   7.3 Test Cases – Model Upload & Registration	31
   7.4 Test Cases – Runtime Provisioning & Inference	31
   7.5 Test Cases – Frontend & Wallet Integration	32
CHAPTER 8: USER MANUAL	33
CHAPTER 9: LIMITATION AND FUTURE ENHANCEMENT	36
   9.1 Limitation	36
   9.2 Future Enhancement	36
CHAPTER 10: CONCLUSION AND DISCUSSION	38
   10.1 Conclusion	38
   10.2 Discussion	38
      10.2.1 Problems Encountered	38
      10.2.2 Possible Solutions	39
      10.2.3 Summary of Project Work	39
CHAPTER 11: REFERENCES	40
CHAPTER 12: EXPERIENCE	41

ABSTRACT

Synapse is a full-stack platform for publishing, discovering, and running AI models as on-demand inference services. The system addresses a fundamental gap in the current AI tooling landscape: while platforms exist for sharing model code, there is no unified workflow that combines verifiable artifact storage, tamper-evident metadata provenance, and one-click runtime execution in an isolated cloud environment.

The platform operates across three layers. First, model artifacts (ZIP packages containing inference code and dependencies) are uploaded to Walrus, a decentralized content-addressed storage network, which returns a unique blob identifier for each artifact. Second, model metadata — including name, description, framework, tags, and the Walrus blob reference — is registered on a Polygon (EVM) smart contract, creating an immutable, publicly auditable record of every published model. Third, when a consumer wishes to run a model, the orchestration backend provisions an isolated runtime sandbox on an AWS EC2 worker node. Inside this sandbox, a Docker container executes a bootstrap sequence that downloads the model from Walrus, installs its Python dependencies, and starts an HTTP inference server exposing a standardized /predict endpoint.

The frontend is built with React, TypeScript, and Tailwind CSS, providing a modern single-page application for wallet connectivity (MetaMask), model browsing, uploading, and an interactive playground for invoking model predictions. The backend orchestration API is built with Node.js and Express, and integrates with AWS services (EC2, Systems Manager) for provisioning and lifecycle management of runtime instances.

Synapse was developed during a final-year internship and demonstrates competency across blockchain integration, decentralized storage, cloud infrastructure orchestration, containerized runtime isolation, and modern frontend engineering.

COMPANY PROFILE

(Company / Organization Name)

(Brief description of the company, its domain, vision, mission, and services — similar to the reference report. Mention that the organization works in software engineering, cloud deployments, product development, or similar. Include address.)

LIST OF FIGURES

Fig No. | Name | Page No.
Fig 4.1 | Use-Case Diagram | XX
Fig 4.2 | Class Diagram | XX
Fig 4.3 | Flow Chart | XX
Fig 5.1 | System Architecture | XX
Fig 5.2 | AWS Deployment Architecture | XX
Fig 5.3 | Dataflow Diagram | XX

LIST OF TABLES

Table No. | Name | Page No.
Table 7.3 | Model Upload & Registration Test Cases | XX
Table 7.4 | Runtime Provisioning & Inference Test Cases | XX
Table 7.5 | Frontend & Wallet Integration Test Cases | XX

CHAPTER 0: TRAINING TAKEN AT INDUSTRY

The training program at the organization was structured to provide a comprehensive foundation in modern software development practices spanning frontend engineering, backend services, blockchain integration, cloud infrastructure, and containerization. Participants were exposed to both theoretical concepts and hands-on implementation, with a strong emphasis on building systems that go beyond simple CRUD applications and address real-world concerns such as runtime isolation, failure handling, and decentralized data integrity.

During the training period, the focus was on developing skills across the following areas:

Frontend Engineering with React and TypeScript: Understanding component-driven architecture, state management with hooks, routing, form validation with libraries such as React Hook Form and Zod, and responsive design using Tailwind CSS. The training covered building single-page applications that interact with both traditional REST APIs and Web3 providers.

Blockchain and Smart Contract Development: Gaining proficiency in Solidity for writing smart contracts, Hardhat for compilation, testing, and deployment, and ethers.js for interacting with EVM-compatible chains from frontend applications. The training focused specifically on Polygon as a cost-effective Layer-2 chain suitable for metadata storage and provenance tracking.

Decentralized Storage with Walrus: Understanding the concept of content-addressed storage, blob identifiers, and object identifiers. Participants learned how to upload artifacts to the Walrus publisher endpoint and retrieve them from aggregator endpoints, along with handling error cases such as network timeouts and invalid references.

Backend API Development with Node.js: Building RESTful APIs using Express.js, implementing middleware for CORS, logging (Morgan), and error handling. The training covered asynchronous patterns, environment-based configuration with dotenv, and designing API contracts that support long-running asynchronous operations using HTTP 202 responses and status polling.

Cloud Infrastructure and AWS: Understanding AWS EC2 instance provisioning using Launch Templates, polling instance state with the AWS SDK, and executing remote commands securely via AWS Systems Manager (SSM) without requiring SSH keys. The training covered IAM roles, security groups, and the concept of worker pools managed by Auto Scaling Groups.

Containerization with Docker: Learning to build Docker images, pass environment variables at runtime, expose container ports, and manage container lifecycle. Participants understood how Docker provides process-level isolation suitable for running untrusted model code in sandboxed environments.

Overall, the training equipped participants with a comprehensive understanding of full-stack development, cloud-native architecture, and decentralized systems, enabling effective contribution to the development of a robust, multi-layered platform like Synapse.

CHAPTER 1: INTRODUCTION

1.1 Project Details

Synapse is a full-stack platform that enables users to upload AI model packages, register model metadata on a blockchain, discover published models through a modern web interface, and execute them as on-demand inference services running in isolated Docker containers on AWS EC2 worker instances.

The project was developed during an internship at (Company Name) under the mentorship of (External Guide Name). The system spans five distinct codebases: a React/TypeScript frontend for user interaction, a Solidity smart contract deployed on Polygon for on-chain model registry, a Node.js backend for orchestration and lifecycle management, a worker service for spawning Docker runtime containers, and a runtime image containing a bootstrap script that downloads models from Walrus and starts an HTTP inference server.

1.2 Purpose

The primary goal of Synapse is to provide a trustworthy and automated platform for AI model sharing and execution. In existing ecosystems, AI models are typically shared as code repositories or binary artifacts without a consistent mechanism for verifying integrity, ensuring reproducible execution environments, or providing standardized inference APIs. This forces consumers into manual setup, dependency troubleshooting, and environment configuration before they can even test a model.

Synapse eliminates this friction by separating artifact storage (Walrus) from metadata provenance (Polygon blockchain) and combining both with automated runtime provisioning (AWS EC2 workers + Docker sandboxes). The result is a system where a publisher uploads once, metadata is recorded immutably, and any consumer can launch a model with a single click and receive a working /predict endpoint within minutes.

1.3 Scope

The project adopts a modular architecture with clearly separated layers. The scope includes:

On-chain model registry on Polygon storing metadata fields such as model name, description, framework, tags, Walrus blob ID, uploader address, and upload timestamp. Artifact storage on Walrus with content-addressed blob identifiers that ensure any consumer or runtime can retrieve the exact artifact the publisher uploaded. Backend orchestration API for managing runtime job lifecycle with state transitions (provisioning, starting_worker, ready, failed) and optional predict proxying. Worker service that receives provisioning requests from the orchestrator and spawns isolated Docker containers, each running on a unique port. Runtime bootstrap that downloads the model ZIP from Walrus, unpacks it, installs Python dependencies, and starts an HTTP server exposing /health and /predict endpoints. Modern React frontend with pages for model browsing, uploading (with wallet-based publishing), and an interactive playground for sending predictions to provisioned runtimes.

1.4 Objective

The key objectives of Synapse are as follows. First, provide a simple, end-to-end workflow for publishing AI models with verifiable metadata that cannot be tampered with after registration. Second, ensure artifact availability and integrity through decentralized content-addressed storage on Walrus. Third, provision reliable, isolated runtime sandboxes using Docker containers on AWS EC2 worker nodes so that each model runs in its own environment without dependency conflicts. Fourth, expose a unified inference API (/predict) that works identically for every model, abstracting away the complexity of different frameworks and configurations. Fifth, track the full lifecycle of each runtime instance with clear status reporting and error capture to support operational reliability. Sixth, deliver a responsive, wallet-integrated web interface that allows users to connect MetaMask, browse models, upload artifacts, and invoke predictions from any modern browser.

1.5 Technology

The technology stack was selected to balance modern development practices with production-grade reliability. The frontend is built using React 19 with TypeScript and Vite as the build tool, styled with Tailwind CSS and enhanced with Radix UI primitives and Framer Motion animations. Blockchain interactions use ethers.js to connect with MetaMask and call Polygon smart contracts compiled and deployed using Hardhat. The backend orchestration API uses Node.js with Express, the AWS SDK v2 for EC2 and SSM integration, and Morgan for request logging. The worker service is a lightweight Express server that uses Node's child_process module to spawn Docker containers. The runtime image is based on Ubuntu 22.04, and the bootstrap entrypoint is a POSIX shell script that installs dependencies, downloads model artifacts from Walrus via curl, and launches a Python HTTP server built on ThreadingHTTPServer.

CHAPTER 2: PROJECT MANAGEMENT

2.1 FEASIBILITY STUDY

2.1.1 Technical Feasibility

From a technical standpoint, the project is feasible because each major requirement maps to mature, well-documented tools. EVM-compatible chains such as Polygon provide stable smart contract deployment and interaction via ethers.js and Hardhat. Walrus offers an API-driven content-addressed blob store accessible from both backend servers and runtime containers via simple HTTP requests. AWS EC2 and Systems Manager (SSM) provide practical primitives for securely provisioning compute instances and executing bootstrap commands without SSH. Docker is a widely adopted standard for process isolation, enabling predictable runtime environments. All chosen technologies are open-source or have free-tier options, and the development team had foundational knowledge of JavaScript, React, Node.js, and cloud services.

2.1.2 Time Schedule Feasibility

The development was structured in a phased approach over approximately 14 weeks. Each phase was assigned a specific timeframe to allow for iterative development, testing, and refinement. The Agile methodology was followed to accommodate evolving requirements — particularly around the bootstrap script reliability and runtime failure handling — and to ensure timely delivery of a working end-to-end system.

2.1.3 Operational Feasibility

The system is designed for operational simplicity. End users require only a modern web browser and a MetaMask wallet to interact with the platform. The backend and worker services run as standard Node.js processes, and the runtime containers are managed automatically. For production deployment on AWS, the operational footprint consists of standard EC2 instances, IAM roles, and security groups — all of which are well-understood by operations teams. During development, the same architecture was simulated locally using Docker, proving that the system can function correctly even without active AWS infrastructure.

2.1.4 Implementation Feasibility

The modular architecture ensures reliable implementation. The frontend, contracts, backend, worker, and runtime are independent codebases that communicate through well-defined interfaces (REST APIs, smart contract ABIs, Walrus HTTP endpoints). This separation allows each component to be developed, tested, and deployed independently. The use of existing frameworks and libraries significantly reduces implementation risk, and the adoption of standard patterns (Express middleware, React hooks, Hardhat deploy scripts) improves code maintainability.

2.2 PROJECT PLANNING

2.2.1 Project Development Approach and Justification

The Agile development model was followed for the development of Synapse. Agile methodology divides the development process into smaller iterations, allowing the team to continuously improve the system based on feedback and testing results. This approach was particularly important for Synapse because the runtime provisioning and bootstrap logic required several iterations to achieve reliability — edge cases such as apt lock contention, missing Python packages, and slow Walrus downloads were discovered and resolved incrementally.

The phases of the Agile model used in this project are as follows:

1. Requirement Gathering

In this phase, the system requirements were collected and analyzed. The goal was to understand the needs of model publishers who want a simple upload-and-register workflow, model consumers who want one-click inference endpoints, and platform operators who need visibility into runtime lifecycle and failures. Functional and non-functional requirements were identified and documented with a focus on separating storage, metadata, orchestration, and execution concerns.

1. System Design

During this phase, the system architecture was designed across all five layers: frontend UI, on-chain registry, backend orchestrator, worker service, and runtime container. Data flows were mapped from model upload through Walrus storage and Polygon registration to runtime provisioning and inference invocation. The smart contract schema, API contracts, and bootstrap script behavior were specified.

1. Construction / Iteration

This phase involved the actual development in multiple iterations. The first iteration delivered the smart contract and frontend upload flow. The second iteration built the backend orchestrator and worker service with basic Docker spawning. The third iteration hardened the bootstrap script with retry logic, venv creation, dependency filtering, and health-check polling. The fourth iteration integrated the Playground page for end-to-end predict calls from the UI.

1. Testing / Quality Assurance

In this phase, the developed modules were tested to ensure correct functionality. The bootstrap script was tested with various model packages including those with missing entrypoints, large dependency trees, and PyTorch requirements. API endpoints were validated using Postman and curl. The frontend wallet flow was tested with MetaMask on Polygon Amoy testnet.

1. Deployment

After successful testing, the system components were prepared for deployment. The frontend builds to a static bundle deployable to any hosting service. The backend and worker run as Node.js services on EC2. The runtime Docker image is built and tagged locally for worker access. In production, the image would be pushed to ECR for distribution across worker nodes.

2.2.2 Group Dependencies

Development Team: Responsible for implementing the system across all five codebases based on the finalized requirements. The development work covered smart contract authoring, frontend component development, backend API design, worker service logic, and runtime bootstrap script engineering.

Testing and Validation: Ensures that provisioned runtimes actually serve correct predictions, that on-chain registrations succeed and are readable, and that the lifecycle state machine transitions correctly through provisioning, ready, and failed states.

2.2.3 Project Scheduling

Initiation Phase (Week 1 – Week 2)
Define project objectives, identify the core problem of model sharing and execution, conduct feasibility analysis, and finalize the technology stack.

Planning Phase (Week 3 – Week 4)
Design the smart contract schema (ModelRegistry.sol), plan the REST API surface for the orchestrator, design the runtime bootstrap sequence, and define the frontend page structure (Home, Models, Upload, Playground).

Development Phase (Week 5 – Week 10)
Set up the monorepo with frontend, contracts, backend, worker, and model-runtime directories. Deploy the ModelRegistry contract on Polygon Amoy testnet. Implement the frontend pages with wallet connectivity, model browsing via on-chain reads, and the upload form with Walrus integration. Build the backend orchestrator with instance lifecycle tracking. Implement the worker service with Docker container spawning. Author and harden the bootstrap shell script with dependency installation, Walrus download, model unpacking, and Python inference server startup.

Testing Phase (Week 11 – Week 12)
Conduct unit testing of the grading and provisioning logic. Perform integration testing across the full pipeline: upload model to Walrus, register on Polygon, provision runtime via backend, call /predict from Playground. Validate error handling for missing entrypoints, failed downloads, and container crashes.

Deployment Phase (Week 13 – Week 14)
Prepare deployment artifacts. Build the frontend production bundle. Configure AWS resources (Launch Template, security groups, IAM roles). Perform final system testing in the target environment. Document the system for handover.

CHAPTER 3: SYSTEM REQUIREMENTS STUDY

3.1 STUDY OF CURRENT SYSTEM

Prior to Synapse, sharing and executing AI models involved fragmented workflows. A publisher would typically push model code to a GitHub repository, sometimes accompanied by pre-trained weight files hosted on cloud storage or model hubs. A consumer wanting to run the model would need to clone the repository, set up a matching Python environment, install dependencies (often encountering version conflicts), download weight files separately, and write custom inference scripts. There was no standardized packaging format, no unified execution environment, and no mechanism for verifying that the artifact a consumer downloaded was the same one the publisher intended to share.

From a provenance perspective, existing platforms store metadata in centralized databases controlled by a single entity, meaning listings can be modified or removed without any auditable trail. There was no system that combined decentralized artifact storage with blockchain-backed metadata to create a trust layer for published models.

3.2 PROBLEMS AND WEAKNESSES OF CURRENT SYSTEM

The manual setup process for running someone else's model is time-consuming and error-prone, requiring consumers to resolve dependency conflicts, locate weight files, and adapt inference code to their environment. There is no standard packaging format that guarantees a model will run identically across different machines. Centralized model registries offer no cryptographic guarantee that the listed metadata or artifact references have not been tampered with. There is no one-click mechanism to provision an isolated execution environment, meaning consumers bear the full operational burden of setting up and managing compute resources. When a model fails to run, consumers have limited debugging information because there is no standardized lifecycle tracking or error reporting.

3.3 USER CHARACTERISTICS

There are three types of users in the Synapse system:

Model Publisher: A publisher connects their MetaMask wallet, uploads a model package (ZIP file) to Walrus via the upload form, fills in metadata (name, description, framework, tags), and submits the registration transaction to the Polygon smart contract. Publishers need familiarity with creating Python-based inference code that exposes a predict function, packaging it with a requirements.txt, and using a Web3 wallet.

Model Consumer: A consumer browses the model registry through the Models page, views model details (uploader address, framework, tags, Walrus reference), and navigates to the Playground page where they can provision a runtime instance. Once the instance reaches the "ready" state, consumers send JSON payloads to the /predict endpoint and receive inference results. Consumers need only a web browser and basic understanding of JSON request/response format.

Platform Administrator / DevOps: An administrator manages the AWS infrastructure — EC2 worker instances, IAM roles, security groups, and Auto Scaling Group capacity. They monitor runtime failures through instance status tracking, review bootstrap logs for debugging, and manage the Docker runtime image lifecycle (building, tagging, and distributing to workers).

3.4 HARDWARE AND SOFTWARE REQUIREMENTS

The Synapse platform does not impose specialized hardware requirements on end users. Any standard computer or mobile device with a modern web browser and internet connectivity is sufficient to access the frontend. For infrastructure, the system requires AWS EC2 instances capable of running Docker containers for model runtime execution.

Hardware:
Processor: Intel Core i3 or above (for development); EC2 instances (t3.medium or higher) for production workers
Storage: Minimum 120 GB on worker nodes for Docker images and model artifacts
RAM: Minimum 4 GB for development; 8 GB or higher recommended for worker nodes running model runtimes

Software:
Operating System: Any OS with a modern browser for end users; Ubuntu 22.04 for EC2 worker instances
Frontend: React, TypeScript, Vite, Tailwind CSS
Backend: Node.js 18+, Express.js, AWS SDK v2
Worker: Node.js 18+, Docker Engine
Runtime: Ubuntu 22.04 Docker image, Python 3, pip
Blockchain: Solidity 0.8.20, Hardhat, ethers.js, MetaMask
Browser: Google Chrome, Firefox, Edge, or Safari with MetaMask extension

3.5 CONSTRAINTS

3.5.1 Hardware Limitations

The frontend is a web-based application accessible from any device with a browser. However, runtime execution requires Docker-capable worker infrastructure. Model packages with large dependencies (e.g., PyTorch) require workers with sufficient disk space and memory. GPU-based models require specialized EC2 instance types (e.g., g4dn) which incur higher costs.

3.5.2 Reliability Requirements

The system requires reliable operation to ensure accurate lifecycle tracking and correct inference results. Runtime provisioning must deterministically reach either a "ready" or "failed" terminal state so that consumers are never left in an ambiguous waiting state indefinitely. The bootstrap script must handle transient failures (apt lock contention, slow Walrus downloads) with retries rather than immediate failure. The on-chain registry must remain consistent — once a model is registered, its metadata must be permanently accessible and unchanged.

3.6 ASSUMPTIONS AND DEPENDENCIES

Users have access to a stable internet connection and a modern web browser with MetaMask installed. The Walrus aggregator and publisher endpoints are reachable from both the user's browser (for uploads) and the runtime containers (for artifact downloads). The Polygon RPC endpoint is available for on-chain read and write operations. Worker EC2 instances have Docker installed and the synapse-runtime image pre-built or pulled from a registry. Model packages follow the required packaging convention: a ZIP file containing at minimum an inference.py file with a predict(payload) function, and optionally a requirements.txt for dependencies.

CHAPTER 4: SYSTEM ANALYSIS

4.1 REQUIREMENTS OF NEW SYSTEM

4.1.1 Functional Requirements

Wallet Connection and Identity:
Input: User clicks "Connect Wallet" and approves the MetaMask prompt.
Output: The connected wallet address is displayed in the navbar and used as the publisher identity for model registration.
Description: The system uses ethers.js to request accounts from the MetaMask provider. Chain switching to Polygon Amoy is handled automatically if the user is on a different network.

Model Upload to Walrus:
Input: User selects a ZIP file via the file dropzone and submits the upload form.
Output: The Walrus publisher returns a blob ID and optionally an object ID confirming successful storage.
Description: The file is uploaded via HTTP PUT to the Walrus publisher endpoint. The system validates file size (maximum 50 MB) and type before uploading. Progress is tracked and displayed to the user.

On-Chain Model Registration:
Input: Walrus identifiers (blob ID, object ID) along with metadata fields (name, description, model type, tags, framework, pricing mode, price per hour).
Output: A successful Polygon transaction hash and the model appearing in the on-chain registry.
Description: The frontend calls the registerModel function on the ModelRegistry smart contract via the user's MetaMask signer. The contract validates that the blob ID is not empty, the name is provided, and the model does not already exist (duplicate check via keccak256 hash of blob ID).

Model Discovery and Browsing:
Input: User navigates to the Models page.
Output: A grid of model cards displaying name, description, framework, tags, uploader address, and upload timestamp.
Description: The frontend calls getAllModels() on the smart contract and renders each model as an interactive card. Users can click a card to view detailed information in a modal.

Runtime Provisioning:
Input: User clicks "Create Instance" on the Playground page for a selected model.
Output: A job ID is returned immediately with status "provisioning", which transitions to "ready" (with a predict URL) or "failed" (with an error message).
Description: The frontend sends a POST request to the orchestrator backend with the model's blob_id and object_id. The backend creates a job record, then asynchronously dispatches a provisioning request to the worker service. The worker spawns a Docker container from the synapse-runtime image, passing the blob ID, object ID, and a randomly assigned port as environment variables.

Runtime Bootstrap and Inference Server:
Input: Environment variables (blob ID, port) injected into the Docker container at startup.
Output: An HTTP server running inside the container on the assigned port, responding to /health and /predict requests.
Description: The bootstrap.sh entrypoint installs system dependencies (curl, unzip, python3), downloads the model ZIP from Walrus using the blob ID, extracts it, creates a Python virtual environment, installs requirements, and launches runner_server.py. The runner dynamically loads the model's predict function from inference.py (or a custom entrypoint specified in model.manifest.json) and serves it via a threaded HTTP server.

Predict API:
Input: JSON payload sent via POST to /predict on the runtime endpoint.
Output: JSON response containing the inference result.
Description: The runner_server.py receives the request, parses the JSON body, invokes the loaded predict function with the payload, and returns the result wrapped in a standardized response envelope.

Instance Cleanup:
Input: DELETE request to the orchestrator for a specific instance ID.
Output: Job tracking data removed from the store; container cleanup delegated to the worker.
Description: The orchestrator removes the instance record and signals the worker to stop and remove the corresponding Docker container.

4.1.2 Non-Functional Requirements

Reliability:
The provisioning pipeline must deterministically reach a terminal state. The bootstrap script implements retry logic for apt package installation with up to three attempts and configurable wait intervals. The health-check polling mechanism attempts up to 60 connection checks before declaring a failure. If the server process dies during startup, the bootstrap captures the error output and reports it clearly.

Performance:
The frontend renders model listings efficiently using React's virtual DOM. Runtime provisioning time depends on model size and dependency installation complexity; for lightweight models without heavy frameworks, provisioning typically completes within 30–60 seconds. The Node.js backend uses non-blocking I/O to handle concurrent provisioning requests without blocking the event loop. The runtime inference server uses Python's ThreadingHTTPServer to handle concurrent prediction requests.

Security:
Each model runtime executes in a separate Docker container, providing process-level and filesystem isolation. The smart contract enforces a duplicate check to prevent the same blob ID from being registered twice. AWS credentials are managed through environment variables and IAM roles, never exposed to the frontend. The bootstrap script sanitizes blob IDs to prevent shell injection. Admin and infrastructure APIs are not exposed to end users in the production configuration.

Usability:
The interface provides a clear step-by-step flow: connect wallet, browse or upload models, select a model, provision a runtime, and send predictions. The upload form provides real-time feedback on file upload progress and registration transaction status. The Playground page displays instance status with clear visual indicators and provides copy-to-clipboard functionality for the predict endpoint.

4.2 USE-CASE DIAGRAM

(Fig 4.1 – Use-Case Diagram)

Actors: Publisher, Consumer, Admin/DevOps
Use Cases: Connect Wallet, Upload Model Package, Register Model On-Chain, Browse Models, View Model Details, Provision Runtime, Send Prediction, View Instance Status, Cleanup Instance, Manage Worker Infrastructure.

4.3 CLASS DIAGRAM

(Fig 4.2 – Class Diagram)

Key classes and modules:
Frontend: Web3Provider, useEvmWallet hook, useBlockchainModels hook, UploadForm, ModelCard, ModelModal, Playground page, polygonRegistry client.
Contracts: ModelRegistry (Solidity) with Model struct, registerModel(), getAllModels(), getModelByBlobId(), modelExists().
Backend: Express app, instances router, store service (loadInstances, getInstance, updateInstance, deleteInstance), awsEc2 service (createEC2Instance, waitForInstanceRunning), awsSsm service (waitForSsm, fetchWalrusBlob, buildBootstrapScript).
Worker: Express server, spawnRuntime function.
Runtime: bootstrap.sh, runner_server.py with Handler class and _load_predictor logic.

4.4 FLOW CHART

(Fig 4.3 – Flow Chart)

The flow begins when a publisher connects their wallet and uploads a model ZIP to Walrus. On successful upload, the publisher submits a registration transaction to the Polygon ModelRegistry contract. Once confirmed, the model appears in the browsable registry. A consumer navigates to the Playground, clicks "Create Instance", and the orchestrator dispatches a worker job. The worker spawns a Docker container, the bootstrap script runs inside the container, and upon successful health check the status transitions to "ready". The consumer sends a prediction request and receives the inference result.

CHAPTER 5: SYSTEM DESIGN

5.1 SYSTEM ARCHITECTURE

(Fig 5.1 – System Architecture)

Synapse follows a layered architecture with five distinct components that communicate through well-defined interfaces:

The Presentation Layer is the React/TypeScript frontend, served as a static single-page application. It communicates with the Polygon blockchain through ethers.js and MetaMask for model registration and retrieval, with the Walrus publisher endpoint for artifact uploads, and with the backend orchestrator API for runtime provisioning and predict proxying.

The Metadata Layer is the ModelRegistry smart contract deployed on Polygon. It stores an array of Model structs and provides view functions for retrieving all models, checking existence by blob ID, and fetching individual model records. The contract emits a ModelRegistered event on each new registration for off-chain indexing.

The Orchestration Layer is the Node.js/Express backend running on an AWS EC2 instance. It exposes REST endpoints for creating, listing, querying, and deleting runtime jobs. When a new job is created, the orchestrator writes an initial record with status "provisioning" and asynchronously dispatches a request to the worker service. It polls the worker response and updates the job status to "ready" or "failed" accordingly.

The Worker Layer is a lightweight Node.js service running on the same or a separate EC2 instance. It receives provisioning requests via HTTP, assigns a random port in the 30000–40000 range, and executes a docker run command to spawn a new container from the synapse-runtime:latest image with the appropriate environment variables.

The Execution Layer is the Docker container itself. The bootstrap.sh entrypoint runs as PID 1 (or launches a background process), performing a deterministic sequence: install OS packages, download model from Walrus, unzip, create Python venv, install pip dependencies, generate the runner_server.py inline, and start the inference server. The runner dynamically loads the user's predict function and serves it over HTTP.

5.2 AWS DEPLOYMENT ARCHITECTURE

(Fig 5.2 – AWS Deployment Architecture)

In production, Synapse is deployed on AWS with the following resource mapping:

The frontend static build is hosted on Amazon S3 behind CloudFront for global CDN distribution and HTTPS termination. Users access the application through a custom domain routed via Route 53.

The backend orchestrator runs on an EC2 instance (or ECS Fargate task) within a public subnet of a VPC. An Application Load Balancer (ALB) fronts the backend for SSL termination and health checking. The orchestrator has an IAM role granting ec2:RunInstances, ec2:DescribeInstances, ssm:SendCommand, and ssm:GetCommandInvocation permissions.

The worker pool consists of one or more EC2 instances provisioned via a Launch Template that pre-installs Docker and the SSM agent. An Auto Scaling Group manages capacity, scaling based on CPU utilization or provisioning queue depth. Workers run in a private subnet with NAT gateway access for outbound Walrus and package repository requests.

AWS Systems Manager (SSM) serves as the control plane for executing bootstrap commands on worker instances. The orchestrator uses SSM RunCommand with the AWS-RunShellScript document to send the bootstrap script to target instances. This approach eliminates the need for SSH key management and provides auditable command execution with stdout/stderr capture.

Security is enforced through security groups (backend SG allows inbound from ALB only; worker SG allows inbound from backend only), IAM roles with least-privilege policies, and Docker container isolation for each runtime sandbox. In production, additional hardening measures such as seccomp profiles, read-only root filesystems, and resource limits (--memory, --cpus) would be applied to runtime containers.

During development, this architecture was simulated locally by replacing EC2 provisioning with direct Docker execution on the development machine. The orchestrator sends requests to a local worker process instead of SSM, and the worker spawns containers using the same Docker image and bootstrap logic. This approach validates the complete provisioning flow while avoiding AWS costs during iterative development.

5.3 DATAFLOW DIAGRAM

(Fig 5.3 – Dataflow Diagram)

Level 0: The external entities are the Publisher (uploads models), the Consumer (requests predictions), Walrus (stores artifacts), Polygon (stores metadata), and AWS (provides compute). The central process is the Synapse Platform.

Level 1 (expanded):
Process 1 – Model Upload: Publisher sends ZIP to Walrus Publisher endpoint, receives blob_id and object_id.
Process 2 – Metadata Registration: Publisher sends metadata + Walrus IDs to Polygon ModelRegistry contract via signed transaction.
Process 3 – Model Discovery: Consumer queries Polygon contract (getAllModels) through the frontend, receives model array.
Process 4 – Runtime Provisioning: Consumer requests provisioning via backend API. Backend creates job record, dispatches to Worker. Worker spawns Docker container on EC2. Bootstrap downloads model from Walrus Aggregator, installs deps, starts server.
Process 5 – Inference: Consumer sends JSON payload to runtime /predict endpoint (directly or via backend proxy). Runtime invokes predict function, returns result.
Process 6 – Lifecycle Management: Backend tracks job status transitions and provides status endpoint. Consumer polls until ready or failed.

CHAPTER 6: IMPLEMENTATION PLANNING

6.1 IMPLEMENTATION ENVIRONMENT

Single vs Multi-user:
Synapse is designed to handle multiple concurrent users. Multiple publishers can upload and register models simultaneously since Walrus and Polygon handle concurrency natively. Multiple consumers can provision separate runtime instances concurrently — each instance runs in its own Docker container on its own port, ensuring complete isolation. The backend orchestrator uses asynchronous request handling (Node.js event loop + setImmediate for provisioning dispatch) to avoid blocking under concurrent load.

GUI vs Non-GUI:
The system is entirely GUI-based for end users, accessed through any standard modern web browser. The React frontend provides a single-page application experience with client-side routing (React Router), eliminating full page reloads during navigation. The interface is structured into distinct pages — Home (landing), Models (browsing), Upload (publishing), Playground (inference), and About (information) — each accessible via the navigation bar. The design uses Tailwind CSS for responsive layouts and Framer Motion for smooth transitions, ensuring usability across desktop and mobile browsers.

Infrastructure-side interactions (SSH into workers, viewing Docker logs) are command-line operations performed by the DevOps administrator and are not part of the end-user experience.

6.2 PROGRAM/MODULE SPECIFICATION

Smart Contract Module (ModelRegistry.sol):
The core on-chain component is the ModelRegistry contract written in Solidity 0.8.20. It defines a Model struct containing fields for uploader address, upload timestamp, Walrus blob ID, Walrus object ID, model name, description, model type, tags (stored as a CSV string), framework, pricing mode, and price per hour. The contract maintains a private array of Model structs and a mapping from the keccak256 hash of each blob ID to the model's index (plus one, to distinguish from the default zero value). The registerModel function validates that the blob ID is non-empty, the name is non-empty, and the model does not already exist, then pushes a new entry and emits a ModelRegistered event. View functions include totalModels(), getAllModels(), getModelByBlobId(), and modelExists().

Frontend Module:
The frontend is structured as a React application with TypeScript. The entry point (main.tsx) renders the App component inside BrowserRouter. The App component wraps all routes in a Web3Provider context that manages wallet state. Key pages include Home (hero section, features overview, FAQ), Models (on-chain model listing with cards), Upload (Walrus upload form + Polygon registration flow), and Playground (instance provisioning + prediction interface).

The UploadForm component implements a two-step process: first, the model ZIP is uploaded to the Walrus publisher endpoint via HTTP PUT, capturing the returned blob ID and object ID; second, the metadata is sent to the Polygon contract via a signed transaction using the connected wallet. The useEvmWallet hook manages MetaMask connectivity, chain switching, and provider/signer access. The useBlockchainModels hook reads the on-chain model array and transforms it into frontend-friendly objects.

The Playground page fetches model details from the chain, provides a "Create Instance" button that calls the backend provisioning API, polls the instance status until ready, displays a countdown timer (30-minute timeout), and offers a text area for entering JSON input and viewing prediction output. It also supports instance deletion and error display.

Backend Orchestration Module:
The backend is a Node.js/Express application structured with a config module, route handlers, and service modules. The config module (config.js) initializes the AWS SDK v2 with region configuration and optional explicit credentials, and exports the EC2 and SSM client instances along with environment-based settings (port, launch template ID, storage file path).

The instances router (routes/instances.js) implements five endpoints. POST /api/instances creates a new job with a timestamp-based ID, writes an initial record with status "provisioning", and dispatches provisioning asynchronously via setImmediate. The provisionInstance function sends a POST request to the worker service, and on success updates the job status to "ready" with the predict URL; on failure, it records the error message. GET /api/instances returns a list of all jobs with their status, blob ID, creation time, and predict URL. GET /api/instances/:instanceId returns the full details of a specific job. POST /api/instances/:instanceId/predict proxies the request body to the runtime's predict URL and returns the upstream response, handling both JSON and non-JSON content types. DELETE /api/instances/:instanceId removes the job record from the store.

The store service (services/store.js) provides CRUD operations on a JSON file that persists job tracking data. Functions include loadInstances (reads and parses the file), saveInstances (writes the full object back), getInstance, updateInstance (merge semantics), and deleteInstance.

The awsEc2 service (services/awsEc2.js) provides createEC2Instance (launches an instance using the configured Launch Template with appropriate tags) and waitForInstanceRunning (polls describeInstances until the instance is running and has a public IP, with configurable timeout).

The awsSsm service (services/awsSsm.js) provides waitForSsm (polls SSM describeInstanceInformation until the instance registers) and fetchWalrusBlob (builds a comprehensive bootstrap shell script and sends it to the instance via SSM RunCommand, then polls getCommandInvocation for completion). The buildBootstrapScript function generates a self-contained POSIX shell script that handles apt lock waiting with retries, dependency installation for both Ubuntu and RHEL-based systems, Walrus download with blob ID and object ID fallback strategies, model directory detection for nested ZIP structures, Python virtual environment creation, requirements filtering (removing non-package lines), special handling for PyTorch CPU-only installations, and the inline generation of runner_server.py.

Worker Module:
The worker is a minimal Express server (server.js) listening on port 4001. It exposes a single POST /run endpoint that receives jobId, blobId, and objectId, calls the spawnRuntime function, and returns the container ID and endpoint URL. The spawnRuntime function (spawnRuntime.js) generates a random port between 30000 and 40000, constructs a docker run command with the appropriate environment variables and port mapping, executes it synchronously via execSync, and returns the trimmed container ID and the endpoint URL.

Runtime Module:
The Docker image (model-runtime/Dockerfile) is based on Ubuntu 22.04, sets the working directory to /opt/synapse, copies bootstrap.sh as the entrypoint, and exposes port 8000. The bootstrap.sh script performs the complete setup sequence: install system packages, download model ZIP from Walrus, extract it, detect the model root directory (handling nested structures and __MACOSX artifacts), create a Python venv, filter and install requirements, generate the runner_server.py HTTP handler inline, start the server as a background process, and poll the /health endpoint until it responds. The runner_server.py dynamically loads the user's predict function by searching for inference.py, handler.py, or model.py (in that order), or by reading a model.manifest.json file that specifies a custom entrypoint. It supports both function-style predictors (predict(payload)) and class-style predictors (Predictor.predict(payload)).

6.3 CODING STANDARDS

ES Module syntax (import/export) is used in the worker and frontend; CommonJS (require/module.exports) is used in the backend for compatibility with the AWS SDK v2. Variable and function names follow camelCase convention, while React components and classes use PascalCase. Constants use UPPER_SNAKE_CASE. The frontend uses component-based architecture with single responsibility per component. All asynchronous operations use async/await with try-catch error handling. Environment variables are used for all sensitive configuration (AWS credentials, contract addresses, API URLs) and are loaded via dotenv on the backend and Vite's import.meta.env on the frontend. The Solidity contract uses NatSpec documentation comments. The bootstrap shell script is POSIX-sh compatible to ensure portability across different Linux distributions. Indentation follows two spaces for JavaScript/TypeScript and four spaces for Python.

CHAPTER 7: TESTING

7.1 TESTING PLAN

Both White Box and Black Box testing approaches were employed for Synapse. White Box testing was applied to the bootstrap script logic, the runtime predict function loading mechanism, and the backend provisioning state machine, since the internal workings are known and must produce correct results under all conditions. Black Box testing was used for frontend flows (wallet connection, upload, model browsing) and end-to-end runtime provisioning validation.

7.2 TESTING STRATEGY

Testing was carried out in a hierarchical manner across the following phases:

Unit Testing: Individual functions including buildBootstrapScript, spawnRuntime, store CRUD operations, and the runner_server.py predict loader were tested with isolated inputs to verify correctness.

Integration Testing: The end-to-end provisioning pipeline (backend receives request, dispatches to worker, worker spawns container, container bootstraps and starts server, backend updates status to ready) was tested to ensure all components interact correctly.

Contract Testing: The ModelRegistry contract was tested using Hardhat's testing framework to verify registration, duplicate prevention, and retrieval functions.

Usability Testing: The frontend was tested for correct navigation flow, wallet connection behavior, upload progress feedback, and Playground interaction patterns across Chrome and Firefox.

7.3 Test Cases – Model Upload & Registration

Test Case | Input | Expected Output | Result
Upload Valid ZIP | Valid model.zip via dropzone | Walrus blob ID returned, progress shown | Pass
Upload Oversized File | File > 50 MB | Error message displayed, upload blocked | Pass
Register Model On-Chain | Metadata + Walrus IDs | Polygon tx hash, model in registry | Pass
Duplicate Registration | Same blob ID as existing model | Transaction reverted, error shown | Pass
Register Without Wallet | Submit without MetaMask connected | Prompt to connect wallet | Pass
Register Empty Name | All fields except name | Validation error, submission blocked | Pass

Table 7.3 – Model Upload & Registration Test Cases

7.4 Test Cases – Runtime Provisioning & Inference

Test Case | Input | Expected Output | Result
Provision Valid Model | blob_id of valid model | Status transitions to "ready", predict_url available | Pass
Provision Invalid Blob | Non-existent blob_id | Status transitions to "failed", error message captured | Pass
Health Endpoint | GET /health on runtime | {"ok": true} | Pass
Predict Endpoint | POST /predict with JSON payload | {"result": ...} with inference output | Pass
Missing inference.py | Model ZIP without entrypoint | Status "failed", error "Missing inference.py" | Pass
Large Dependency Model | Model with PyTorch requirement | CPU-only torch installed, server starts | Pass
Instance Deletion | DELETE /api/instances/:id | Job removed from store | Pass
Concurrent Provisioning | Two simultaneous provision requests | Both containers start on different ports | Pass

Table 7.4 – Runtime Provisioning & Inference Test Cases

7.5 Test Cases – Frontend & Wallet Integration

Test Case | Input | Expected Output | Result
Connect MetaMask | Click "Connect Wallet" | Wallet address displayed in navbar | Pass
Wrong Network | MetaMask on Ethereum mainnet | Prompt to switch to Polygon Amoy | Pass
Browse Models | Navigate to /models | Model cards rendered from on-chain data | Pass
Model Detail Modal | Click model card | Modal with full metadata displayed | Pass
Playground Create Instance | Click "Create Instance" | Instance ID returned, status polling begins | Pass
Playground Predict | Enter JSON, click "Run" | Prediction result displayed | Pass
Playground Delete | Click "Delete Instance" | Instance removed, UI reset | Pass
Responsive Layout | Resize browser to mobile width | Layout adapts correctly | Pass

Table 7.5 – Frontend & Wallet Integration Test Cases

CHAPTER 8: USER MANUAL

Home Page:
The landing page presents an overview of the Synapse platform with a hero section, feature highlights (decentralized storage, on-chain provenance, one-click inference), and a call-to-action to browse or upload models.
(Screenshot – Home Page)

Connect Wallet:
Click "Connect Wallet" in the navigation bar. Approve the MetaMask popup to share your wallet address. If you are on the wrong network, MetaMask will prompt you to switch to Polygon Amoy.
(Screenshot – Wallet Connection)

Browse Models:
Navigate to the "Models" page via the navbar. All registered models are displayed as cards showing the model name, description, framework, tags, and uploader address. Click any card to view full details in a modal.
(Screenshot – Models Page)

Upload Model:
Navigate to the "Upload" page. Ensure your wallet is connected. Drag and drop a ZIP file containing your model package into the file dropzone (or click to browse). Fill in the metadata fields: name, description, model type, framework, and tags. Click "Upload to Walrus" to store the artifact. After Walrus returns the blob ID, click "Register on Polygon" to submit the on-chain transaction. Wait for the transaction to confirm.
(Screenshot – Upload Page)

Model Details:
From the Models page, click on a model card to open the detail modal. The modal displays the uploader's wallet address, Walrus blob ID, framework, tags, pricing information, and the upload timestamp.
(Screenshot – Model Detail Modal)

Playground – Provision Runtime:
From the model detail view or the Models page, click "Playground" to navigate to the interactive runtime page. Click "Create Instance" to provision a new runtime sandbox. The system will display a status indicator showing the provisioning progress. Wait until the status changes to "Ready".
(Screenshot – Playground Provisioning)

Playground – Run Prediction:
Once the instance is ready, enter a JSON payload in the input text area (e.g., {"text": "Hello Synapse"}). Click "Run" to send the prediction request. The response will appear in the output area.
(Screenshot – Playground Prediction)

Playground – Delete Instance:
When you are done, click the delete button to remove the instance. This stops the runtime container and frees the allocated port.
(Screenshot – Playground Delete)

CHAPTER 9: LIMITATION AND FUTURE ENHANCEMENT

9.1 LIMITATION

The runtime provisioning time is directly dependent on the size of the model package and the number of Python dependencies that need to be installed. For models with large frameworks like PyTorch or TensorFlow, the bootstrap process can take several minutes, which may feel slow compared to pre-warmed environments.

The current implementation uses a JSON file for tracking runtime job state. This is suitable for development and demonstration purposes but does not provide the durability, concurrent access safety, or query capabilities needed for production workloads with many simultaneous users.

Docker container isolation, while effective for dependency separation and basic process isolation, does not provide the same security guarantees as hardware-level virtualization or dedicated sandbox runtimes like gVisor or Firecracker. Running arbitrary user-uploaded code remains inherently risky without additional hardening measures.

The on-chain model registry stores all metadata in a single contract's storage array. For very large numbers of models (tens of thousands), gas costs for read operations may increase, and off-chain indexing would be required for efficient search and filtering.

There is no integrated billing or payment settlement mechanism. While the contract schema includes pricing mode and price-per-hour fields, the actual payment flow between consumer and publisher is not implemented.

9.2 FUTURE ENHANCEMENT

Implement a durable job store using DynamoDB or PostgreSQL to replace the JSON file, enabling reliable concurrent access, historical queries, and integration with monitoring systems.

Add stronger runtime sandboxing using gVisor or Firecracker micro-VMs to provide hardware-level isolation for untrusted model code, along with resource limits (CPU, memory, network) per container.

Build an off-chain indexer that listens to ModelRegistered events from the contract and populates a searchable database, enabling fast full-text search, tag filtering, and pagination without on-chain read costs.

Implement JWT-based authentication for the backend API so that runtime endpoints are not publicly accessible and usage can be tracked per user.

Add GPU worker support with specialized EC2 instance types (g4dn, p3) and a scheduler that routes GPU-required models to GPU-equipped workers.

Develop a marketplace payment flow using smart contracts for escrow-based billing, where consumers pay per inference call or per runtime hour and publishers receive settlement.

Implement model versioning in the registry contract, allowing publishers to register updated versions of a model while preserving access to previous versions.

Add a React Native or PWA frontend for improved mobile accessibility.

Integrate observability tooling (structured logs, CloudWatch metrics, distributed tracing) for production monitoring and debugging.

CHAPTER 10: CONCLUSION AND DISCUSSION

10.1 CONCLUSION

Synapse successfully delivers a functional, end-to-end platform that bridges the gap between AI model sharing and AI model execution. By combining Walrus for decentralized artifact storage, Polygon for tamper-evident metadata provenance, and AWS EC2 with Docker for isolated runtime orchestration, the system provides a workflow that is fundamentally more trustworthy and operationally simpler than manual model sharing through code repositories and ad-hoc setup scripts.

The platform demonstrates the viability of treating AI models as deployable services rather than static artifacts. A publisher uploads once, registers metadata immutably, and any consumer can provision an isolated runtime and obtain a working inference endpoint within minutes. The architecture cleanly separates concerns — storage, provenance, orchestration, and execution — making it possible to evolve each layer independently.

Built across five codebases using React, TypeScript, Solidity, Node.js, and Docker, the project demonstrates competency in modern frontend engineering, smart contract development, backend API design, cloud infrastructure patterns, and container-based runtime isolation.

10.2 DISCUSSION

10.2.1 Problems Encountered

Bootstrap Reliability: The most challenging aspect was making the bootstrap script work reliably across different model packages. Early versions frequently failed due to apt lock contention (when the EC2 instance's own package manager was still running), missing Python packages, and models with non-standard directory structures (nested folders, __MACOSX artifacts). Each failure mode required careful diagnosis through SSM command output logs and iterative script improvements.

Dynamic Predict Loading: Supporting multiple predictor formats (function-style, class-style, custom manifest entrypoints) required careful dynamic module loading in Python. Edge cases included models that defined predict as a class method rather than a standalone function, and models that expected a string argument rather than a dictionary.

Wallet and Chain Management: Ensuring a smooth MetaMask experience across different scenarios (wrong chain, rejected transaction, wallet locked, multiple accounts) required defensive error handling and clear user feedback in the frontend.

AWS Cost Constraints: The intended AWS architecture required active EC2 instances and SSM access, which incur costs. Without a dedicated budget, development required simulating the full provisioning flow locally using Docker while ensuring the code paths for AWS and local execution remained compatible.

10.2.2 Possible Solutions

The bootstrap script was hardened incrementally over multiple iterations: apt lock waiting with retries was added, dependency installation was made idempotent, ZIP extraction was made robust to nested structures with a pick_root_dir function, requirements.txt was filtered to remove non-package lines, and PyTorch was detected and installed separately using CPU-only builds to reduce download size. Health check polling was implemented to wait for the server to become responsive rather than assuming immediate startup.

The predict loader was built with a priority chain (inference.py → handler.py → model.py), manifest support for custom entrypoints, and a fallback from dict-style to string-style invocation to accommodate different model signatures.

Environment variables and configuration-based endpoint URLs were used throughout to allow switching between AWS-based and local Docker-based execution without code changes.

10.2.3 Summary of Project Work

Synapse was conceived, designed, and developed as a multi-component platform from scratch during the final year internship. The project demonstrates competency across smart contract development (Solidity + Hardhat), modern frontend engineering (React + TypeScript + Tailwind + Web3 integration), backend orchestration (Node.js + Express + AWS SDK), containerized runtime execution (Docker + shell scripting + Python dynamic loading), and cloud infrastructure design (EC2, SSM, Launch Templates, security groups, IAM). The experience gained through this project provides a strong foundation for building production-grade distributed systems that combine Web3 provenance with cloud-native operations.

CHAPTER 11: REFERENCES

React Documentation: [https://react.dev/](https://react.dev/)
Node.js Documentation: [https://nodejs.org/en/docs](https://nodejs.org/en/docs)
Express.js Documentation: [https://expressjs.com/](https://expressjs.com/)
Hardhat Documentation: [https://hardhat.org/docs](https://hardhat.org/docs)
ethers.js Documentation: [https://docs.ethers.org/](https://docs.ethers.org/)
Polygon Documentation: [https://docs.polygon.technology/](https://docs.polygon.technology/)
Walrus Documentation: [https://docs.walrus.site/](https://docs.walrus.site/)
AWS EC2 Documentation: [https://docs.aws.amazon.com/ec2/](https://docs.aws.amazon.com/ec2/)
AWS Systems Manager Documentation: [https://docs.aws.amazon.com/systems-manager/](https://docs.aws.amazon.com/systems-manager/)
Docker Documentation: [https://docs.docker.com/](https://docs.docker.com/)
Solidity Language Documentation: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)
OWASP Top 10: [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)
Tailwind CSS Documentation: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
Vite Documentation: [https://vitejs.dev/guide/](https://vitejs.dev/guide/)

CHAPTER 12: EXPERIENCE

During my final year, I developed Synapse as a Full Stack Developer — an AI Model Marketplace and Runtime Orchestration Platform that enables publishing, discovering, and running AI models as on-demand inference services backed by blockchain provenance and decentralized storage.

The most challenging and rewarding aspect was building the runtime provisioning pipeline end-to-end. This required understanding how AWS EC2 instances are launched programmatically using Launch Templates, how SSM RunCommand can execute bootstrap scripts remotely without SSH, how Docker containers provide process isolation, and how a shell script can reliably transform a raw Ubuntu image into a functioning inference server. The bootstrap script went through multiple iterations as I encountered real-world failure modes — apt lock contention from concurrent package manager processes, models with unexpected directory structures, and Python dependency conflicts. Each iteration taught me to write more defensive, retry-capable code.

On the blockchain side, writing and deploying the ModelRegistry smart contract deepened my understanding of Solidity storage patterns, event emission for off-chain indexing, and the gas cost implications of storing strings on-chain. Integrating MetaMask from the React frontend required careful handling of asynchronous wallet operations, chain switching, and transaction error states.

The frontend development honed my React and TypeScript skills, particularly around managing complex state in the Playground page where multiple asynchronous operations (instance creation, status polling, prediction requests, timeout countdown) run concurrently. I learned to use useEffect cleanup functions and status flags to prevent stale state updates.

For the backend, designing the orchestration API taught me patterns for handling long-running asynchronous operations in HTTP services — returning 202 Accepted immediately and providing a polling endpoint for status, rather than blocking the request until provisioning completes.

One of the most satisfying moments was the first successful end-to-end test: uploading a model ZIP to Walrus, registering it on Polygon, provisioning a runtime from the Playground, and receiving a correct prediction response — all within a few minutes. It validated that the entire multi-layer architecture worked as designed.

Through this project, I gained hands-on experience across an unusually broad technical surface area: smart contract development, decentralized storage integration, cloud infrastructure automation, container orchestration, Python runtime execution, and modern frontend engineering. I am grateful to (External Guide Name) for mentorship and practical guidance throughout this journey.