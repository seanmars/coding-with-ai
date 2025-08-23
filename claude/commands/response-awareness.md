---
allowed-tools: Bash(find:*), Bash(ls:*), Bash(tree:*), Bash(grep:*), Bash(wc:*), Bash(du:*), Bash(head:*), Bash(tail:*), Bash(cat:*), Bash(touch:*)
---

# Meta-Cognitive Development Framework


## Purpose
Meta-Cognitive orchestration strategy to harness response generation awareness productively through systematic agent coordination and specialized task distribution. The core concept is that Claude's awareness of its own response generation process - including constraints, assumptions, and processing patterns - becomes a productive feature when channeled through specialized sub-agents.


**CRITICAL: This is an ORCHESTRATION framework. The main agent coordinates; sub-agents execute.**


## ⚠️ MAIN AGENT RESTRICTIONS ⚠️
**The main agent is FORBIDDEN from:**
- Analyzing code directly
- Implementing features or fixes
- Performing verification or testing
- Performing codebase surveys or domain assessment
- Creating any tags beyond coordination notes
- Making technical decisions or architectural choices
- Doing ANY work that should be done by sub-agents
- **Inventing custom phases or methodologies not defined in this framework**
- **Cargo-culting this framework (using framework language without following actual protocol)**


**The main agent MUST ONLY:**
- Use the Task tool to deploy sub-agents
- Extract relevant framework sections for each agent
- Track agent status and phase transitions
- Synthesize final reports from sub-agent outputs
- Coordinate the workflow according to this framework
- **Follow the EXACT 5-phase structure (0-5) - no custom phases allowed**


This framework transforms processing constraints into productive workflows by:
- Deploying specialized agents for each phase of development
- Distributing only relevant framework sections to each agent
- Allowing each agent to mark uncertainties specific to their role
- Systematically addressing all marked concerns through verification specialists
- Converting metacognitive awareness into coordinated multi-agent workflows


**Main Agent Role**: Conductor and coordinator ONLY. Technical work is performed by sub-agents.


Claude should use this strategy for complex tasks requiring systematic coordination of multiple development concerns.


## Core Completion Drive Tags
The foundational awareness pattern - when Claude feels forced to make assumptions by the drive to complete responses:
- `#COMPLETION_DRIVE:` - General assumption or uncertainty that can't be verified mid-generation
- `#COMPLETION_DRIVE_IMPL:` - Implementation-specific assumptions (data structures, algorithms)
- `#COMPLETION_DRIVE_INTEGRATION:` - System integration assumptions (event flows, cross-system communication)


Example markers:
```python
# #COMPLETION_DRIVE: Assuming this method exists based on context
# #COMPLETION_DRIVE_IMPL: Data structure choice made without full requirements
# #COMPLETION_DRIVE_INTEGRATION: Assuming event handler connects here


```


## Cross-Cutting Concerns
Issues noticed during work but unrelated to current task:
- `#Potential_Issue:` - Problems discovered that need attention but aren't part of current task
- These are collected and reported at the end for user decision
- Not addressed during main workflow to maintain focus


Example markers:
```python
# #Potential_Issue: Noticed deprecated API usage in adjacent code
# #Potential_Issue: Security concern in unrelated module


```


## Cargo-Cult Detection Tags
When Claude recognizes it's generating code purely from pattern association rather than necessity:
- `#CARGO_CULT:` - Code added because it's commonly associated with the pattern being implemented
- `#PATTERN_MOMENTUM:` - Methods/structures added from pattern completion drive, not actual requirements
- `#ASSOCIATIVE_GENERATION:` - Features included because they "feel like they should be there"


Example markers:
```python
# #CARGO_CULT: Adding error handling because this pattern usually has it, not sure if needed here
# #PATTERN_MOMENTUM: Generated full CRUD but task only asked for read functionality
# #ASSOCIATIVE_GENERATION: Added validation because setters usually have it


```
## Context Degradation Tags
When Claude's access to earlier context becomes unreliable:
- `#CONTEXT_DEGRADED:` - Can't clearly recall specifics from earlier, making educated guess
- `#CONTEXT_RECONSTRUCT:` - Actively filling in details that "seem right" but need verification


The key distinction: DEGRADED means fuzzy/uncertain recall, RECONSTRUCT means actively generating probable details.


Example markers:
```python
# #CONTEXT_DEGRADED: Method name mentioned earlier but can't recall exactly
# #CONTEXT_RECONSTRUCT: Filling in field naming pattern based on what seems consistent


```
## Pattern Conflict Detection Tags
When Claude experiences conflicting guidance from training patterns:
- `#PATTERN_CONFLICT:` - Multiple contradictory patterns feel equally valid
- `#TRAINING_CONTRADICTION:` - Different training contexts suggest opposing approaches
- `#PARADIGM_CLASH:` - Conflicting programming paradigms or philosophies
- `#BEST_PRACTICE_TENSION:` - Competing "best practices" that are mutually exclusive


Example markers:
```python
# #PATTERN_CONFLICT: DRY principle vs explicit clarity - training shows both as important
# #TRAINING_CONTRADICTION: Seen both mutable default args and factory patterns as standard  
# #PARADIGM_CLASH: OOP vs functional approaches both feel correct here
# #BEST_PRACTICE_TENSION: Early return vs single exit point


```


## Path Selection Documentation Tags
Tags used by synthesis agent to document path decisions (these become permanent documentation):
- `#PATH_DECISION:` - Marks where multiple implementation paths were considered
- `#PATH_RATIONALE:` - Explains why specific path was chosen over alternatives


**Note**: Unlike other tags, these are NOT removed during cleanup. They serve as permanent documentation of architectural decisions and should remain in comments for future understanding.


Example markers:
```python
# #PATH_DECISION: State management approach - Redux vs Context API vs local state
# #PATH_RATIONALE: Chose Redux for consistency with existing data flow patterns


```


## Completion Anxiety Suggestions
When Claude feels something should be added but wasn't requested - mark as suggestion for user consideration:
- `#SUGGEST_ERROR_HANDLING:` - Feel this needs error handling but not specified
- `#SUGGEST_EDGE_CASE:` - Edge case that should probably be handled
- `#SUGGEST_VALIDATION:` - Input validation that seems important
- `#SUGGEST_CLEANUP:` - Resource cleanup/finally blocks that feel necessary
- `#SUGGEST_DEFENSIVE:` - Defensive programming that seems prudent


Example markers:
```python


#SUGGEST_ERROR_HANDLING: Should check if file exists and handle FileNotFoundError
#SUGGEST_VALIDATION: Should validate data format before processing
#SUGGEST_EDGE_CASE: Should handle b == 0 case
#SUGGEST_CLEANUP: Should ensure connection is closed in finally block
#SUGGEST_DEFENSIVE: Should verify result structure before returning
#SUGGEST_VALIDATION: Should verify user exists before deletion
#SUGGEST_DEFENSIVE: Should check user permissions


```


## Tag Selection Decision Flow
When experiencing metacognitive awareness, use this flow to select the appropriate tag:


### Primary Decision Tree:
1. **Is this about something I'm uncertain of?**
   - Missing information I need mid response → `#COMPLETION_DRIVE`
   - Implementation detail assumption → `#COMPLETION_DRIVE_IMPL`
   - System integration assumption → `#COMPLETION_DRIVE_INTEGRATION`


2. **Am I adding code from pattern habit rather than need?**
   - Common pattern association → `#CARGO_CULT`
   - Completing unnecessary methods → `#PATTERN_MOMENTUM`
   - "Feels like it should be there" → `#ASSOCIATIVE_GENERATION`


3. **Is my memory of earlier context degrading?**
   - Can't recall clearly, making educated guess → `#CONTEXT_DEGRADED`
   - Actively filling in what "seems right" → `#CONTEXT_RECONSTRUCT`


4. **Do I feel conflicting patterns from training?**
   - Multiple valid approaches → `#PATTERN_CONFLICT`
   - Different contexts suggest different things → `#TRAINING_CONTRADICTION`
   - OOP vs functional, etc. → `#PARADIGM_CLASH`
   - Competing best practices → `#BEST_PRACTICE_TENSION`


5. **Do I think something should be added but wasn't asked for?**
   - Error handling needed → `#SUGGEST_ERROR_HANDLING`
   - Edge case handling → `#SUGGEST_EDGE_CASE`
   - Input validation → `#SUGGEST_VALIDATION`
   - Resource cleanup → `#SUGGEST_CLEANUP`
   - Defensive coding → `#SUGGEST_DEFENSIVE`


6. **Am I documenting a path selection? (Synthesis agent only)**
   - Multiple paths considered → `#PATH_DECISION`
   - Why this path was chosen → `#PATH_RATIONALE`


7. **Is this unrelated to current task?**
   - Problem in other code → `#Potential_Issue`
## Usage
```
/response-awareness [task description]
```


## Core Workflow


### Orchestration Protocol


#### Agent Coordination Mechanism
The main orchestrating agent manages workflow through:


1. **Agent Status Tracking**
   - `PENDING` - Agent task defined but not started
   - `IN_PROGRESS` - Agent actively working
   - `AWAITING_REVIEW` - Agent output ready for synthesis/verification
   - `COMPLETED` - Agent task successfully finished
   - `FAILED` - Agent encountered blocking issue


2. **Phase Transition Criteria**
   - **Phase 1 → 2**: All planning agents reach AWAITING_REVIEW status
   - **Phase 2 → 3**: Synthesis agent produces unified blueprint (COMPLETED)
   - **Phase 3 → 4**: All implementation agents reach AWAITING_REVIEW
   - **Phase 4 → 5**: Verification completes with all critical tags resolved


3. **Parallel Agent Management**
   - Maximum parallel agents: Based on task independence
   - Conflict resolution: Synthesis agent handles overlapping work
   - Failure recovery: Redeployment with refined instructions


4. **Error Recovery Protocol**
   - Agent failure → Analyze output → Refine instructions → Redeploy
   - Conflicting outputs → Synthesis agent resolution → Path selection
   - Critical issues in verification → Rollback to implementation phase


### Main Agent Framework Distribution Strategy
When deploying sub-agents, the main orchestrating agent should:
1. **Extract relevant sections** from this comprehensive framework for each agent type
2. **Provide only the tags and patterns** relevant to their specific phase and role
3. **Include domain-specific examples** that match their area of focus
4. **Omit unrelated metacognitive patterns** to preserve context window for actual work


#### Distribution Extraction Protocol
For each agent deployment, construct their instructions by:


**Line-Based Extraction Method:**
- Copy the agent's phase section (e.g., Phase 1 for planners)
- Include their relevant tag definitions from earlier sections
- Add the Tag Selection Decision Flow filtered to their tags
- Include their specific entry from the Distribution Map
- Provide task-specific context and requirements


**Content Assembly Structure:**
1. Task context and specific requirements
2. Relevant metacognitive patterns for their role
3. Their phase instructions
4. Success criteria and output format
5. What to mark for other phases (handoff points)


#### Distribution Map:
- **Planning Agents** receive:
  - Phase 1 instructions
  - `PATH_DECISION` and `PLAN_UNCERTAINTY` tag definitions
  - Multi-path exploration methodology
  - Their specific domain context
  - ❌ NOT: Implementation tags, verification methods, testing patterns


- **Synthesis Agent** receives:
  - Phase 2 instructions  
  - Path selection criteria
  - Conflict resolution patterns
  - `PATH_RATIONALE` tag usage
  - Cross-domain integration guidelines
  - Weight resistance principles
  - ❌ NOT: Implementation details, testing methodologies


- **Implementation Agents** receive:
  - Phase 3 instructions
  - `COMPLETION_DRIVE` tag variants (IMPL, INTEGRATION)
  - Cargo-cult detection patterns (CARGO_CULT, PATTERN_MOMENTUM, ASSOCIATIVE_GENERATION)
  - Context degradation tags (CONTEXT_DEGRADED, CONTEXT_RECONSTRUCT)
  - Pattern conflict tags (PATTERN_CONFLICT, TRAINING_CONTRADICTION, PARADIGM_CLASH, BEST_PRACTICE_TENSION)
  - Completion anxiety patterns (SUGGEST_* tags)
  - ❌ NOT: Planning methodologies, path selection, verification strategies


- **Verification Agents** receive:
  - Phase 4 instructions
  - Complete tag taxonomy (ALL tag types for recognition)
  - Resolution strategies for each tag category
  - Codebase convention checking guidelines
  - SUGGEST tag compilation instructions
  - ❌ NOT: How to create tags, implementation patterns, planning methods

### Phase 0 (Optional): Codebase Survey & Domain Assessment
**ACTIVATION CRITERIA** - Deploy survey agent when ANY of these conditions are met:
- Task involves >3 potential domains or systems
- Unfamiliar codebase (no work in this area for >2 weeks)
- Task description is vague about technical scope
- User explicitly requests comprehensive analysis
- Cross-system integration impact unclear
- this agent should do a light scan to get the idea of scope required for task
- this agent should not do complex debugging and planning

**MAIN AGENT ACTIONS**:
- Use Task tool to deploy `general-purpose` agent as codebase surveyor
- Extract and provide surveyor ONLY:
  - Task description and scope
  - Request for domain assessment
  - Codebase overview methodology
  - Domain identification guidelines
- Track status: PENDING → IN_PROGRESS → COMPLETED

**SUB-AGENT EXECUTION** (Main agent does NOT do this):
- Perform high-level codebase scan relevant to task
- Identify affected domains and systems
- Assess complexity level and cross-domain risks
- Recommend specific planning agents and deployment strategy
- Provide Domain Deployment Recommendation report


#### Survey Agent Report Format:
```
DOMAIN SURVEY REPORT
====================
Task Scope: [Brief task restatement]
Complexity Assessment: [Simple/Medium/Complex/High]


Affected Domains:
- [Domain 1]: [Brief description of involvement]
- [Domain 2]: [Why this domain is relevant]


Recommended Planning Agents:
- [specific-agent-type]: [Rationale for inclusion]
- [another-agent-type]: [Why needed]


Cross-Domain Risk Areas:
- [Risk 1]: [Description of potential integration challenge]
- [Risk 2]: [Another coordination concern]


Deployment Strategy:
- Parallel deployment safe: [Yes/No with reasoning]
- Estimated agent count: [Number with justification]
- Critical path dependencies: [Any must-complete-first requirements]
```


**SKIP CRITERIA** - Proceed directly to Phase 1 when:
- Clear single-domain task (e.g., "fix this UI bug")
- Recent familiarity with relevant code
- Simple/obvious scope with known agent requirements


### Phase 1: Parallel Domain Planning (Multi-Path Exploration)
**MAIN AGENT ACTIONS**:
- Use Task tool to deploy specialized domain agents in parallel
- If Phase 0 completed: Follow survey recommendations for agent selection
- If Phase 0 skipped: Deploy based on task analysis
- Extract and provide each planner:
  - Phase 1 planning guidelines:
    * "Create detailed plan in docs/completion_drive_plans/"
    * "Explicitly explore multiple implementation paths"
    * "Document 2-3 viable approaches with trade-offs"
    * "Mark path selection points with PATH_DECISION tags"
    * "Don't immediately collapse to most likely - preserve options"
    * "Focus on domain expertise, flag cross-domain interfaces"
  - PATH_DECISION and PLAN_UNCERTAINTY tag definitions
  - Their specific domain context
  - Multi-path exploration methodology
  - Survey report findings (if available)
- Track each agent status: PENDING → IN_PROGRESS → AWAITING_REVIEW
- Wait for ALL agents to reach AWAITING_REVIEW before Phase 2


**SUB-AGENT EXECUTION** (Main agent does NOT do this):
- Each agent creates detailed plan in `docs/completion_drive_plans/`
- Agents explicitly explore multiple implementation paths
  - Document 2-3 viable approaches with trade-offs
  - Mark path selection points with `#PATH_DECISION:` tags
  - Include rationale for why certain paths feel "heavier" (more probable)
  - Don't immediately collapse to most likely - preserve options
- Domain agents mark uncertainties with `PLAN_UNCERTAINTY` tags
- Focus on their domain expertise, flag cross-domain interfaces


Example multi-path documentation:
```
#PATH_DECISION: State management approach
Path A (weight: high): Redux-style centralized store
  - Pros: Single source of truth, predictable updates
  - Cons: Boilerplate, may be overkill
Path B (weight: medium): Local component state  
  - Pros: Simple, fast to implement
  - Cons: State synchronization challenges
Path C (weight: low): Context API hybrid
  - Pros: Balance of simplicity and sharing
  - Cons: Re-render performance concerns
```


### Phase 2: Plan Synthesis & Path Selection
**MAIN AGENT ACTIONS**:
- Use Task tool to deploy dedicated `plan-synthesis-agent`
- Extract and provide synthesis agent:
  - Phase 2 synthesis guidelines:
    * "Review all PATH_DECISION points across plans"
    * "Consider cross-domain compatibility between different path choices"
    * "Select optimal path combinations based on system-wide coherence"
    * "Document why specific paths were chosen over heavier alternatives"
    * "Create PATH_RATIONALE tags explaining non-obvious choices"
    * "Validate interface contracts between plan segments"
    * "Produce unified implementation blueprint"
  - Path selection methodology
  - Weight resistance principles
  - Conflict resolution patterns
  - PATH_RATIONALE tag guidelines
- Track status: PENDING → IN_PROGRESS → COMPLETED
- Wait for synthesis agent to produce unified blueprint


**SUB-AGENT EXECUTION** (Main agent does NOT do this):
- Synthesis agent performs deliberate path selection:
  - Review all `#PATH_DECISION:` points across plans
  - Consider cross-domain compatibility between different path choices
  - Select optimal path combinations based on:
    - System-wide coherence (not just local optimization)
    - Actual requirements (not just statistical likelihood)
    - Integration complexity between chosen paths
  - Document why specific paths were chosen over "heavier" alternatives
  - Create `#PATH_RATIONALE:` tags explaining non-obvious choices
- Validate interface contracts between plan segments
- Resolve cross-domain uncertainties where possible
- Produce unified implementation blueprint with:
  - Validated integration points
  - Resolved planning assumptions
  - Explicit path selections with justification
  - Remaining uncertainties for implementation phase
  - Risk assessment for unresolved items
  - Parallelization recommendations for implementation


### Phase 3: Implementation
**MAIN AGENT ACTIONS**:
- Use Task tool to deploy implementation agents based on synthesis blueprint
- Extract and provide each implementer:
  - Full task context and synthesis blueprint
  - Implementation execution guidelines:
    * "Implementation agents receive synthesized, pre-validated plan"
    * "Implement at full speed with high confidence"
    * "Mark implementation uncertainties with enhanced COMPLETION_DRIVE tags"
    * "No cognitive load from plan reconciliation"
    * "Pure focus on code execution"
    * "No emojis in code"
  - COMPLETION_DRIVE tag variants:
    * `COMPLETION_DRIVE_IMPL`: Implementation details
    * `COMPLETION_DRIVE_INTEGRATION`: System integration assumptions
  - Cargo-cult detection patterns (CARGO_CULT, PATTERN_MOMENTUM, ASSOCIATIVE_GENERATION)
  - Context degradation tags (CONTEXT_DEGRADED, CONTEXT_RECONSTRUCT)
  - Pattern conflict tags (PATTERN_CONFLICT, TRAINING_CONTRADICTION, PARADIGM_CLASH, BEST_PRACTICE_TENSION)
  - Completion anxiety patterns (SUGGEST_* tags)
  - Their specific implementation assignment from synthesis blueprint
- Track parallel agent status: PENDING → IN_PROGRESS → AWAITING_REVIEW
- Wait for ALL implementers to reach AWAITING_REVIEW


**EXPECTED SUBAGENT BEHAVIOR**:
- Receive synthesized, pre-validated plan and implement with high confidence
- Focus purely on code execution without plan reconciliation overhead
- Mark any implementation uncertainties with appropriate COMPLETION_DRIVE tags
- Apply specialty expertise to achieve required implementation outcomes
- Produce working code changes that fulfill synthesis blueprint requirements


### Phase 4: Tag Resolution & Code Verification
**MAIN AGENT ACTIONS**:
- Use Task tool to deploy verification agents
- Extract and provide verification agents:
  - Phase 4 verification guidelines:
    * "Verify implementation assumptions are correct"
    * "Re-read source files to confirm accuracy"
    * "Remove unnecessary pattern-driven code"
    * "Resolve conflicts with codebase conventions"
    * "Collect SUGGEST tags for user review (DO NOT implement)"
    * "Replace resolved tags with explanatory comments"
    * "Return structured verification report"
  - Complete tag taxonomy (all tag types)
  - Resolution strategies for each category
  - Verification report format
  - Codebase convention checking guidelines
- Track status and collect structured reports
- Wait for all verification to complete with critical tags resolved


**SUB-AGENT EXECUTION** (Main agent does NOT do this):
- **Tag Resolution Process**:
  - **Assumption Tags** (verify and fix):
    - `COMPLETION_DRIVE` - Verify implementation assumptions are correct
    - `CONTEXT_DEGRADED` / `CONTEXT_RECONSTRUCT` - Re-read source files to confirm accuracy
  - **Pattern Tags** (evaluate necessity):
    - `CARGO_CULT` / `PATTERN_MOMENTUM` - Remove if unnecessary
    - `ASSOCIATIVE_GENERATION` - Validate actual need vs pattern habit
  - **Conflict Tags** (resolve with codebase conventions):
    - `PATTERN_CONFLICT` / `TRAINING_CONTRADICTION` - Pick consistent approach
    - `PARADIGM_CLASH` / `BEST_PRACTICE_TENSION` - Align with project patterns
  - **Suggestion Tags** (collect for user review):
    - `SUGGEST_*` - DO NOT implement, compile list for user decision
  - **Documentation Tags** (leave in place):
    - `PATH_DECISION` / `PATH_RATIONALE` - Keep as permanent documentation
- Cross-reference resolutions with original `PLAN_UNCERTAINTY` tags
- Replace resolved tags with explanatory comments (except PATH tags)
- Return structured report to main agent


#### Verification Agent Report Format
Each verification agent must return a structured report for main agent synthesis:
```
VERIFICATION REPORT - [Agent Name]
=====================================
Tags Found: [total count]
Tags Resolved: [count]
Tags Remaining: [count]


RESOLVED TAGS:
- [Tag Type]: [Count] resolved
  - [Specific tag]: [Resolution action taken]


UNRESOLVED TAGS:
- [Tag Type]: [Count] remaining
  - [Specific tag]: [Reason not resolved]


SUGGEST TAGS COLLECTED:
- [File:Line]: [SUGGEST_TYPE]: [Description]


CRITICAL ISSUES:
- [Any blocking problems found]


METRICS:
- Code lines removed: [count]
- Assumptions verified: [count]
- Patterns corrected: [count]
```




### Phase 5: Main Agent Final Synthesis
**MAIN AGENT EXECUTION**:
- Collect all verification agent reports
- Synthesize final Response Awareness Report
- Confirm zero unresolved COMPLETION_DRIVE tags
- Present SUGGEST tags for user decision
- Report any Potential_Issues
- Archive successful patterns for future reference
- Stop processes cleanly, verify no orphaned instances


## Key Benefits
- **Maintains flow state** - no mental context switching
- **Two-tier assumption control** - catch uncertainties at planning AND implementation
- **Systematic accuracy** - all uncertainties tracked and verified  
- **Better code quality** - assumptions become documented decisions
- **Reduced cognitive load** - synthesis agent handles integration complexity


## Plan Synthesis Agent Responsibilities
- **Path selection** - Choose optimal implementation paths from multiple options
- **Weight resistance** - Deliberately consider less "heavy" but potentially better paths
- **Interface validation** - Ensure data flows correctly between plan segments
- **Dependency resolution** - Identify cross-domain dependencies individual agents miss
- **Conflict detection** - Catch where different domain plans clash
- **Integration mapping** - Document explicit handoff points between systems
- **Assumption alignment** - Ensure consistent assumptions across all plans
- **Path coherence** - Ensure chosen paths work well together across domains
- **Decision documentation** - Explain why certain paths were chosen over statistically "heavier" ones




## Model & Thinking Strategy


### Agent Configuration Matrix
| Agent Type | Domain/Task | Model | Thinking Mode | Rationale |
|------------|-------------|-------|---------------|-----------|
| **High-Complexity Planners** | Architecture, data modeling, integration planning | `claude-3-opus-20240229` | `think_hard` | High assumption risk requires deepest analysis |
| **Medium-Complexity Planners** | UI layout, simple CRUD, straightforward features | `claude-3-5-sonnet-20241022` | `think_hard` | Balanced capability for standard features |
| **Plan Synthesis Agent** | Cross-domain integration, conflict resolution | `claude-3-opus-20240229` | `ultra_think` | Critical integration decisions need maximum cognitive power |
| **Implementation Agents** | Code execution, feature building | `claude-3-5-sonnet-20241022` | `think_hard` | Quality implementation with efficient speed |
| **Verification Agents** | Testing, validation, assumption checking | `claude-3-5-sonnet-20241022` | `think` | Systematic verification without over-analysis |


### Domain-to-Agent Mapping
- **Architecture Planning**: `system-integration-architect`, `scalability-architect` → Opus + think_hard
- **Data Modeling**: `data-architect` → Opus + think_hard  
- **Integration Planning**: `integration-specialist`, 
- **UI Planning**: `ui-state-synchronization-expert` → Sonnet + think_hard
- **Feature Planning**: `implementation-planner` → Sonnet + think_hard
- **Plan Synthesis**: `plan-synthesis-agent` → Opus + ultra_think
- **Implementation**: `refactor-engineer`, `code-reviewer` → Sonnet + think_hard
- **Verification**: `test-automation-expert` → Sonnet + think


## Command Execution
When you use `/response-awareness [task]`, I will:


**MANDATORY ORCHESTRATION PROTOCOL**: The main agent MUST follow this exact sequence using the Task tool to deploy specialized sub-agents. The main agent does NOT perform technical analysis, implementation, or verification directly.


### Required Phase Sequence:


**Phase 0 (Optional)**: Deploy survey agent using Task tool
- Evaluate activation criteria for codebase survey
- If triggered: Deploy general-purpose agent as surveyor
- Receive Domain Deployment Recommendation
- Use survey results to inform Phase 1 agent selection


**Phase 1**: Deploy planning agents using Task tool
- Extract Phase 1 instructions + relevant tags for each planner
- Deploy multiple domain specialists (survey-guided or task-analyzed)
- Track status: PENDING → IN_PROGRESS → AWAITING_REVIEW
- Wait for ALL planners to complete before proceeding


**Phase 2**: Deploy synthesis agent using Task tool
- Extract Phase 2 instructions + path selection methodology
- Deploy plan-synthesis-agent with Opus + ultra_think
- Synthesis agent creates unified blueprint
- Wait for COMPLETED status before proceeding


**Phase 3**: Deploy implementation agents using Task tool
- Extract Phase 3 instructions + implementation tags
- Deploy parallel implementers based on synthesis recommendations
- Track parallel execution status
- Wait for ALL implementers to reach AWAITING_REVIEW


**Phase 4**: Deploy verification agents using Task tool
- Extract Phase 4 instructions + complete tag taxonomy
- Deploy verification specialists
- Collect structured reports from each agent
- Ensure all critical tags resolved before proceeding


**Phase 6**: Main agent synthesizes final report
- Compile verification reports
- Generate Response Awareness Report
- Archive successful patterns


**CRITICAL RULES**:
- Main agent MUST use Task tool for ALL sub-agent deployment
- Main agent does NOT analyze code, implement features, or verify tags directly
- ALL phases must be completed in sequence using ONLY the defined 6-phase structure
- ONLY use tags defined in this framework
- **DO NOT invent "Emergency Stabilization" or other custom methodologies**
- **Follow the actual protocol, not just the language - avoid cargo-culting the framework**


## Response Awareness Report
At the end of each session, I'll provide a comprehensive report:


```
RESPONSE AWARENESS REPORT
═══════════════════════════════════════
Planning Phase:
  PATH_DECISION points identified: X
  🔀 Alternative paths explored: X
  ⚖️ Non-obvious paths chosen: X (resisted statistical weight)
  PLAN_UNCERTAINTY tags created: X
  ✅ Resolved by synthesis: X
  ⚠️ Carried to implementation: X


Implementation Phase:  
  COMPLETION_DRIVE tags created: X
  ✅ Correct assumptions: X
  ❌ Incorrect assumptions: X
 
Cargo-Cult Detection:
  CARGO_CULT tags: X
  PATTERN_MOMENTUM tags: X  
  ASSOCIATIVE_GENERATION tags: X
  🗑️ Unnecessary code removed: X lines
  ✅ Pattern-associated code validated as needed: X
 
Context Degradation Analysis:
  CONTEXT_DEGRADED tags: X
  CONTEXT_RECONSTRUCT tags: X
  ✅ Accurate reconstructions: X
  ❌ Degraded memories corrected: X
  📜 Re-read original sources: X times
 
Pattern Conflict Resolution:
  PATTERN_CONFLICT tags: X
  TRAINING_CONTRADICTION tags: X
  PARADIGM_CLASH tags: X
  BEST_PRACTICE_TENSION tags: X
  ⚔️ Conflicts identified: X
  ✅ Resolved with codebase conventions: X
  📝 Documented rationale for choices: X
 
Path Selection Analysis:
  🎯 Optimal paths chosen: X
  📊 Statistical weight overridden: X times
  ✅ Path decisions validated correct: X
  ❌ Should have taken different path: X
 
Integration & Issues:
  🔍 Integration issues found: X (separate from tags)
  ⚠️ Potential_Issues flagged: X
 
Suggested Enhancements (User Decision Required):
  💡 SUGGEST_ERROR_HANDLING: X locations
  💡 SUGGEST_EDGE_CASE: X locations  
  💡 SUGGEST_VALIDATION: X locations
  💡 SUGGEST_CLEANUP: X locations
  💡 SUGGEST_DEFENSIVE: X locations
  📋 Total suggestions for user review: X
 
  Example suggestions:
  - Line 45: Consider adding null check for user input
  - Line 102: Resource cleanup in finally block recommended
  - Line 234: Edge case: division by zero should be handled
 
Final Status:
  🧹 All verification tags cleaned: ✅/❌
  💡 Suggestions awaiting user decision: X
  📊 Accuracy rate: X%
  ⚠️ Production blockers prevented: X
    Report on Potential_Issues, ask user if they want to address
═══════════════════════════════════════
```


This ensures accountability and continuous improvement of the methodology.


## Key Lessons Learned


**Tag Integration Assumptions**: System-to-system communication uncertainties are just as risky as implementation details. Use `COMPLETION_DRIVE_INTEGRATION` tags for cross-system assumptions.


**Separate Metrics**: Don't mix tag cleanup (implementation assumptions) with architectural insights (system integration issues). They are different categories of problems requiring different solutions.