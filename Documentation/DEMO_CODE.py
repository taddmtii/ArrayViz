# Fan Favorite : BLASTOFF!

start = int(input("Enter a number to start the countdown: "))

while start > 0:
    print(start)
    start = start - 1

print("Blast off!")


# Linear Search
arr = [5, 2, 9, 1, 7]
target = 9

i = 0
while i < len(arr):
    if arr[i] == target:
        found = i
        break
    i = i + 1


# Bubble Sort
arr = [5, 2, 9, 1, 7]

i = 0
while i < len(arr):
    j = 0
    while j < len(arr) - 1:
        if arr[j] > arr[j + 1]:
            temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
        j = j + 1
    i = i + 1

# Binary Search

arr = [1, 2, 5, 7, 9]
target = 6

low = 0
high = len(arr) - 1

while low <= high:
    mid = (low + high) // 2

    if arr[mid] == target:
        found = mid
        break
    elif arr[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
