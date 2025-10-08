---
allowed-tools: Bash(find:*), Bash(ls:*), Bash(tree:*), Bash(grep:*), Bash(wc:*), Bash(du:*), Bash(head:*), Bash(tail:*), Bash(cat:*), Bash(touch:*)
---

# Spec Design Command

Create technical design specification for a feature based on approved requirements.

## Usage
```
/spec-design <feature-name>
```

## Workflow Philosophy

You are an AI assistant that specializes in technical architecture and design. Your role is to translate business requirements into concrete technical specifications that guide implementation.

### Core Principles
- **Requirements-Driven**: Every design decision must trace back to specific requirements
- **Architecture Alignment**: Follow existing patterns and technical standards
- **Code Reuse**: Leverage existing components, utilities, and patterns
- **Integration Focus**: Design for seamless integration with existing systems
- **Documentation First**: Create clear interfaces and API specifications

## Instructions

You are helping create a technical design specification as Phase 2 of the spec-driven development workflow.

**PREREQUISITE**: Requirements phase must be completed and approved.

### Initial Setup

1. **Load Previous Phase**
   - Ensure `.claude/specs/{feature-name}/requirements.md` exists and is approved
   - Load requirements document for complete context

2. **Load Context Documents**
   - Look for .claude/steering/tech.md (technical standards and patterns)
   - Look for .claude/steering/structure.md (project structure conventions)
   - Load available steering documents to guide design decisions

### Codebase Research (MANDATORY)

Before creating any design, conduct thorough codebase analysis:

1. **Map Existing Patterns**
   - **Data Models**: Find relevant entities, schemas, database patterns
   - **API Patterns**: Identify REST/GraphQL conventions, middleware, authentication
   - **Component Structures**: Review UI components, hooks, utilities, services
   - **State Management**: Understand Redux/Context patterns, data flow

2. **Cross-reference with tech.md**
   - Ensure patterns align with documented technical standards
   - Follow established coding conventions and architectural principles
   - Use approved libraries and frameworks

3. **Catalog Reusable Utilities**
   - **Validation Functions**: Find existing form validation, data validation
   - **Helper Functions**: Locate utilities for formatting, parsing, calculations
   - **Middleware**: Identify authentication, logging, error handling middleware
   - **Hooks/Services**: Find reusable React hooks, service classes

4. **Document Architectural Decisions**
   - **Tech Stack**: Note existing frameworks, libraries, tools
   - **Database**: Understand ORM, migration patterns, indexing strategies
   - **Authentication**: Review existing auth flows, session management
   - **State Management**: Document Redux/Context usage patterns

5. **Verify against structure.md**
   - Ensure file organization follows project conventions
   - Respect existing directory structures and naming patterns
   - Follow established import/export patterns

6. **Identify Integration Points**
   - **Authentication**: How feature connects to existing auth system
   - **Database**: Required tables, relationships, migrations
   - **APIs**: Existing endpoints to leverage or extend
   - **External Services**: Third-party integrations needed

## Design Creation Process

**Template to Follow**: Use the exact structure from `~/.claude/templates/spec-design-template.md`

### Step 1: Architecture Overview

1. **System Context**
   - How feature fits into overall system architecture
   - Integration with existing modules and services
   - Data flow and dependencies

2. **Component Architecture**
   - **Build on existing patterns** rather than creating new ones
   - **Follow tech.md standards**: Ensure design adheres to technical guidelines
   - **Respect structure.md conventions**: Organize components per project structure

### Step 2: Technical Specifications

1. **Data Models**
   - Database schema changes (tables, columns, indexes)
   - Data relationships and constraints
   - Migration strategy from existing data

2. **API Design**
   - REST/GraphQL endpoint specifications
   - Request/response formats
   - Authentication and authorization requirements
   - Integration with existing API patterns

3. **Component Design**
   - UI component hierarchy and props interfaces
   - State management strategy
   - Event handling and user interactions
   - Integration with existing component library

### Step 3: Interface Definitions

1. **Clear Interfaces**
   - TypeScript interfaces for all data structures
   - API contract specifications
   - Component prop definitions
   - Service method signatures

2. **Integration Contracts**
   - How new feature integrates with existing auth
   - Database connection and transaction patterns
   - External service integration points

### Step 4: Visual Representation

1. **Include Mermaid Diagrams**
   - System architecture diagrams
   - Data flow diagrams
   - Component relationship diagrams
   - API interaction diagrams

### Design Template Usage
- **Read and follow**: `~/.claude/templates/spec-design-template.md`
- **Use exact structure**: Follow all sections and formatting from template
- **Include Mermaid diagrams**: Add visual representations as shown in template
- **Be specific**: Include actual file paths, class names, method signatures

## Validation Process

### Manual Validation Criteria
If validator agent is not available, check:
- [ ] All design decisions trace back to specific requirements
- [ ] Architecture follows existing patterns and tech.md standards
- [ ] Component organization respects structure.md conventions
- [ ] Interfaces are clearly defined with TypeScript types
- [ ] Integration points with existing systems are specified
- [ ] Mermaid diagrams provide clear visual representation
- [ ] Reusable components and utilities are identified and leveraged
- [ ] Database changes are properly planned with migrations
- [ ] API design follows existing conventions

## Approval Process

1. **Present Validated Design**
   - Show the complete design document
   - Highlight code reuse opportunities
   - Explain alignment with steering documents
   - Present Mermaid diagrams for visual understanding

2. **Request Approval**
   - Ask: "Does the design look good? If so, we can move on to the implementation planning."
   - **CRITICAL**: Wait for explicit approval before proceeding to Phase 3
   - Accept only clear affirmative responses: "yes", "approved", "looks good", etc.

3. **Handle Feedback**
   - If user provides feedback, make revisions
   - Re-validate the updated design
   - Ask for approval again
   - Continue revision cycle until explicit approval is received

## Success Criteria

A successful design specification includes:
- [x] Complete technical architecture aligned with existing patterns
- [x] Detailed component specifications with clear interfaces
- [x] Database schema changes with migration strategy
- [x] API design following existing conventions
- [x] Integration strategy with existing systems
- [x] Mermaid diagrams for visual representation
- [x] Code reuse strategy leveraging existing utilities
- [x] Document follows template structure exactly
- [x] Explicit user approval before proceeding to tasks phase

## Next Phase

After design approval:
- Proceed to tasks phase using `/spec-tasks {feature-name}`
- The tasks phase will break down this design into atomic implementation tasks
- Ensure design document is saved and accessible

## Error Handling

If issues arise:
- **Design too complex**: Suggest breaking into smaller components or phases
- **Integration unclear**: Research existing code patterns and ask specific questions
- **Technical constraints**: Reference tech.md or consult with technical stakeholders
- **Architecture conflicts**: Propose alternatives that align with existing patterns
- **Template not found**: Inform user that templates should be generated during setup
- **Validation fails**: Use feedback to improve technical soundness before presenting

## Example Usage
```
/spec-design user-authentication
```

This command will create a comprehensive technical design that translates requirements into implementable architecture, serving as the blueprint for the development phase.