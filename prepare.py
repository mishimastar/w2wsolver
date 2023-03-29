from PIL import Image, ImageFilter , ImageChops
import numpy as np
import sys

def virus(matrix: np.ndarray, i, j, cnt, buf: list):
    if i >= 0 and j >=0 and i < matrix.shape[1] and j < matrix.shape[0]:
        if matrix[j][i] == True:
            matrix[j][i] = False
            cnt+=1
            buf.append([j,i])
            virus(matrix, i, j+1, cnt, buf)
            virus(matrix, i, j-1, cnt, buf)
            virus(matrix, i+1, j, cnt, buf)
            virus(matrix, i-1, j, cnt, buf)
 

    # print(i,j)


def findWhite(matrix: np.ndarray) :
    rois = []
    cnt = 0
    matrix.setflags(write=1)
    print(matrix.shape)
    for y in range(0, matrix.shape[0]):
        for x in range(0, matrix.shape[1]):
            if matrix[y][x] == True:
                cnt+=1
                cc = 0
                buf = []
                area = virus(matrix, x, y, cc, buf)
                # print(cc, buf)
    # for row in matrix:
    #     print(row.size)
    #     for cell in row:
    #         if cell == True:
    #             rois.append([])
    print(cnt)


# './orig3.jpg'
img = Image.open(sys.argv[1]).resize((591, 1280))
# img.show()
print(img.size[1])
h = img.size[0]
v = img.size[1]
print(h, v)
# box = (250, 250, 750, 750)
thresh = 215
fn = lambda x : 255 if x > thresh else 0

img2 = img.crop((0,int(v/3.2),h,int(v/1.28))).convert('L').point(fn, mode='1')

sqrSizeH = 108
sqrSizeV = 111

leftUpH = 29
leftUpV = 430
rightDownH = leftUpH + sqrSizeH
rightDownV = leftUpV + sqrSizeV

for y in range(0,5,1):
    for x in range(0,5,1):
        buf = img.crop((leftUpH + sqrSizeH * x,leftUpV + sqrSizeV * y, rightDownH+sqrSizeH*x, rightDownV + sqrSizeV* y)).convert('L').filter(ImageFilter.GaussianBlur(radius = 1)).point(fn, mode='1')
        imgArr = np.array(buf)
        # print('=================')
        # findWhite(imgArr)
        # Image.fromarray(imgArr).save('./parts/{}_{}.jpg'.format(y,x))
        ImageChops.invert(buf).save('./parts/{}_{}.jpg'.format(y,x))


# img2.show()
img2.save('./bw.jpg')
