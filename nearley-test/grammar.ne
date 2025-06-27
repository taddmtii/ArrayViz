# LEVEL 1 

IDENTIFIER -> [a-zA-Z_] [a-zA-Z0-9_]:*

DECIMAL -> [1-9] [0-9]:*

HEX -> "0x" [0-9a-fA-F]:+

BINARY -> "0b" [0-1]:+

NUMBER -> DECIMAL | # 13, 41, 20 
           HEX | # 0x13AF 
           BINARY # 0b0010 

COMMA -> ","

LSQBRACK -> "["

RSQBRACK -> "]"

LPAREN -> "("

RPAREN -> ")"

PRINT -> "print"

EQ -> "="

number_list -> NUMBER (COMMA number_list):? # 3 OR 3, OR 3, 4 OR 3, 4, 

list -> LSQBRACK number_list RSQBRACK | # [1, 2, 3] 
         LSQBRACK RSQBRACK # [] (or empty list) 

assignment_statement -> IDENTIFIER EQ NUMBER | # i = 5, num = 2 
              IDENTIFIER EQ IDENTIFIER | # i = num, num = other_num 
              IDENTIFIER EQ IDENTIFIER LSQBRACK NUMBER RSQBRACK | # num = nums[1] 
              IDENTIFIER LSQBRACK NUMBER RSQBRACK EQ NUMBER | # nums[1] = 5 
              IDENTIFIER LSQBRACK NUMBER RSQBRACK EQ IDENTIFIER LSQBRACK NUMBER RSQBRACK | # nums[1] = nums[4] 
              IDENTIFIER EQ list # nums = [1, 2, 3] 
              

statement -> IDENTIFIER LSQBRACK NUMBER RSQBRACK # nums[1] 

print_func -> PRINT LPAREN RPAREN | # print() 
               PRINT LPAREN NUMBER RPAREN | # print(5) 
               PRINT LPAREN IDENTIFIER LSQBRACK NUMBER RSQBRACK RPAREN # print(nums[0]) 