Potential Tech Stack:

React (frontend)
Node.js + Express.js (backend)
PostgreSQL (Database)

// prediction aspect of learning (what changes if what executes)
What will happen if I increment this index?
If I swap these two elements, what’s next?
What will happen when we execute the next line
// would this be a good fit to use instead of pythontutor

PythonTutor is excellent for tracing code execution, this tool offers a more focused environment designed specifically for array algorithms as opposed to abstract code visualization. Manual manipulation is the key difference.
// dynamic vs static allocation with consideration to pythons lists (dynamic by nature) *prefer fixed size
Fixed size it is.

Prompt
Array Access Simulation: Help students in CPTR-215 Fundamentals of Software Design (CS2) and CPTR-318 Data Structures & Algorithms understand array searching and sorting algorithms by walking them through “executing” the algorithms by hand, accessing, comparing, and moving individual array elements using index variables (which can be incremented/decremented or recalculated manually), and keeping track of the number of operations performed (to give a rough estimation of time and/or space complexity)

Title: ArrayViz: An interactive array simulation for array traversal and manipulation of fundamental algorithms.

Abstract: 

Introduction: Array searching and sorting algorithms are foundational in computer science academia. Unfortunately, students often struggle to internalize on a deeper level these concepts when taught solely through pseudocode or static diagrams. ArrayViz allows for that gap to be diminished, providing an interactive, step by step simulation environment where students can manipulate array elements using custom parameters and index variables. Students will be able to observe the effect of comparisons and swaps, and track the number of operations to intuitively grasp time complexity, a fundamental concept in understanding the time and space efficiency of an algorithm. By simulating algorithms at this low level, the project bridges the gap between theoretical abstraction and practical insight, making it easier for students to master fundamental algorithmic thinking. 

Problem Statement: Students often struggle with visualizing these simple algorithms when the concept is first introduced, with traditional teaching methods typically presenting algorithms as abstract pseudocode or static diagrams or graphs. These examples fail to provide students with an interactive understanding of how these algorithms operate at a lower level.

Hypothesis: ArrayViz aims to enhance students' fundamental understanding of Array searching and sorting algorithms, and will result in better understanding of the subject matter among students.

Limitations: Limitations include lack of reliable and consistent data, and lack of prior extensive research on how to cater to different learning styles, like those who are auditory learners instead of visual learners. // look into learning styles

Delimitations: 
Focus on array based algorithms exclusively
Only core algorithms will be included such as..
Linear Search
Binary Search
Bubble Sort
Selection Sort
Insertion Sort
Merge sort
Quicksort
Does not teach syntax explicitly other than index variables.
English only (duh)
Limited browser compatibility, with potential for explicit mobile support.  

Justification:  The need for an educational tool is clearly imperative, one that allows students to step through array algorithms in a guided manner that emphasizes the crucial role of index variables and array operations. ArrayViz aims to bridge the present gap between theory and implementation.

Objectives:
Supports custom index variables
Step through algorithm process
Main info on how arrays work/documentation
User authentication (potential)
Database interaction to save students progress or visualizations
Eclass integration with mini quizzes (potential)
Time complexity analysis (counting steps)
Leaderboards
Potential achievement system (Gameification) (for instance, sort an array in *** amount of steps or complete all search algorithms).

Questions to answer:

What the code we are executing should look like? (pseudocode, python, block based (blockly - block code library))

    Block based makes the most amount of sense.

What data types should we deal with?

    Integers and chars.

Actors:
[Student<<actor>>]
[Instructor<<actor>>]
[Administrator<<actor>>]

User Stories:
Register -> Student
Login -> Student 
Save instance -> Student
Load instance -> Student
Integrate with eClass -> Student
Take periodic quizzes -> Student
Set custom indexing variabels -> Student
Step through selected algorithm process -> Student
Access documentation for each process -> Student
View and create leaderboard entries -> Student
Count steps for time complexity -> Student
Earn achievements -> Student

Create quizzes -> Instructor
Manage student progress -> Instructor
View/manage leaderboards -> Instructor

Manage -> Administrator