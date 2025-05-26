*inspired* by template: https://www.perforce.com/blog/alm/how-write-software-requirements-specification-srs-document

Project: ArrayViz <br>
Prepared by: Tadd Trumbull <br>
Course: CPTR-486 Senior Seminar

# 1. Introduction
    1.1 Purpose and Intended Use

        Define the functional and non-functional requirements for ArrayViz, which is an interactive educational tool for visualing array operations and algorithms. ArrayViz aims to help students understand these fundamental array sorting algorithms by simulating execution manually, while also allowing the student to alter opeations such as indexing and swapping. 
        
    1.2 Intended Audience (Actors)

        Students: The indended user base, undergraduate students enrolled in programming courses such as Fundamentals of Software Design or Data Structures and Algorithms.

        Instructor: Professor who is utilizing this tool to help support teaching.

        Administrators: Developers and system admins, needed for maintenance.
        
    1.3 Product Scope

        ArrayViz simulates core array based searching and sorting algorithms by supporting step by step alteration of array elements, and giving visual feedback on operations with analytics to supplement understanding of time complexity. 

    1.4 Definitions
        
        Index Variable: A pointer or placeholder value that is initialized to track/access a position in an array.

        Fixed-size Array: Non-dynamic, linear data structure that holds a collection of elements of the same data type stored contiguously in memory.

        Sorting Algorithms: A series of instructions within a program that takes an array as an argument, performs operations on the array, and outputs a sorted array.

        Searching Algorithms: A series of instructions within a program that takes an array as an argument, performs operations to search the array, and outputs the target value.

# 2. Overall Descriptions
    2.1 User Needs

        - Visual simulation of array based algorithms
        - Step by step execution using index variables
        - Tracking of comparison, access, and swap operations.
        - User account management
        - Progress saving/loading
        - Quizzes and gamification

    2.2 Assumptions and Dependencies

        - student preconceived

# 3. System Features and Requirements
    3.1 Functional Requirements
        - what software does (user stories)
        - update variable
        - update contents of array
        
    3.2 External Interface Requirements

    3.3 System Features

    3.4 Nonfunctional Requirements
        - what platforms
        - what performance
        - limitations