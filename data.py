import matplotlib.pyplot as plt
import csv

x = []
y = []

with open('data3.csv','r') as csvfile:
	lines = csv.reader(csvfile, delimiter=',')
	for row in lines:
		x.append(int(row[0]))
		y.append(float(row[1]))

plt.plot(x, y, color = 'g', linestyle = 'dashed',
		marker = 'o',label = "words in table")

plt.xticks(rotation = 25)
plt.xlabel('epoch')
plt.ylabel('words')
plt.title('words in table', fontsize = 10)
plt.grid()
plt.legend()
plt.show()
