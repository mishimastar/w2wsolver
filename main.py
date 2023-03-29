# importing the required module
import matplotlib.pyplot as plt
import numpy as np

# x axis values
xs = np.array([])
# corresponding y axis values
ys = []


def apply(num):
    if (num % 2 == 0):
        return num / 2
    else:
        return num * 3 + 1


for y in range(1, 1000):
    counter = 0
    start = y
    while (start != 1):
        start = apply(start)
        print(start)
        ys[int(start)] +=1
        counter += 1
    if (y % 10000 == 0):
        print(y, counter)
        

# plotting the points
print(xs)
print(ys)
plt.plot(ys)

# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')

# giving a title to my graph
plt.title('title')

# function to show the plot
plt.show()
