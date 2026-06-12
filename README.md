# visual-reasoning-workspace
A non-linear AI chat workspace with semantic node linking and shared contextual memory.

## Overview

It is a visual AI workspace that allows users to explore ideas through connected conversations instead of a single linear chat thread.

Each conversation exists as a node on an infinite canvas. Nodes can be linked together to create relationships between ideas, enabling AI conversations to build upon related discussions across the workspace.

## Following image can help visualize it

<img width="1578" height="1153" alt="main ui wireframe" src="https://github.com/user-attachments/assets/290c39c7-cb7b-4371-9aad-73e11b81b82d" />

## Current MVP Progress

### Completed

- Infinite canvas using React Flow
- Custom conversation nodes
- Zustand state management
- PostgreSQL persistence for:
  - Node creation
  - Node position
  - Node dimensions
  - Workspace viewport (pan & zoom)

### In Progress

- Edge creation
- Edge persistence

### Planned

- AI conversations
- Message persistence
- Semantic node linking
- Shared contextual memory
- Node summaries
- Linked-node context retrieval

## Core Features

### Conversation Nodes

Each node represents an independent AI conversation.

* Continue conversations within a node
* Resize and reposition nodes freely
* Organize thoughts visually on an infinite canvas

### Semantic Node Linking

Links are not just visual connections.

When nodes are linked, they can share contextual awareness during AI interactions.

This transforms isolated conversations into a connected knowledge graph.

### Shared Context Memory

When generating a response, the AI can use:

* Recent messages from the current node
* The current node summary
* Summaries from directly linked nodes

This allows related conversations to influence each other while remaining independently stored.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* React Flow
* Zustand

### Backend

* PostgreSQL
* OpenAI API

## Database Model

<img width="2816" height="1536" alt="ERD" src="https://github.com/user-attachments/assets/79435ffb-89a4-4a68-83ed-4df65747aeae" />

## Project Status

Actively under development.
