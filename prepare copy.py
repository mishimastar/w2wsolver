from PIL import Image, ImageFilter 
import cv2
import numpy as np

img = Image.open('./orig3.jpg')
# img.show()
# print(img.size[1])
h = img.size[0]
v = img.size[1]
print(h, v)
# box = (250, 250, 750, 750)
thresh = 150
fn = lambda x : 255 if x > thresh else 0

img2 = img.crop((0,int(v/3.2),h,int(v/1.28))).convert('L').filter(ImageFilter.GaussianBlur(radius = 2)).point(fn, mode='1')

sqrSizeH = 108
sqrSizeV = 111

leftUpH = 29
leftUpV = 430
rightDownH = leftUpH + sqrSizeH
rightDownV = leftUpV + sqrSizeV

for y in range(0,5,1):
    for x in range(0,5,1):
        buf = img.crop((leftUpH + sqrSizeH * x,leftUpV + sqrSizeV * y, rightDownH+sqrSizeH*x, rightDownV + sqrSizeV* y)).convert('L').point(fn, mode='1')
        imgArr = np.asarray(buf)
        print(imgArr.shape)
        # for row in imgArr:
        #    print(row)


        buf.save('./parts/{}_{}.jpg'.format(y,x))




# img2.show()
img2.save('./bw.jpg')

# img = cv2.imread('./bw.jpg', cv2.IMREAD_GRAYSCALE)

# # find all of the connected components (white blobs in your image).
# # im_with_separated_blobs is an image where each detected blob has a different pixel value ranging from 1 to nb_blobs - 1.
# nb_blobs, im_with_separated_blobs, stats, _ = cv2.connectedComponentsWithStats(img)
# # stats (and the silenced output centroids) gives some information about the blobs. See the docs for more information. 
# # here, we're interested only in the size of the blobs, contained in the last column of stats.
# sizes = stats[:, -1]
# # the following lines result in taking out the background which is also considered a component, which I find for most applications to not be the expected output.
# # you may also keep the results as they are by commenting out the following lines. You'll have to update the ranges in the for loop below. 
# sizes = sizes[1:]
# nb_blobs -= 1

# # minimum size of particles we want to keep (number of pixels).
# # here, it's a fixed value, but you can set it as you want, eg the mean of the sizes or whatever.
# min_size = 500  

# # output image with only the kept components
# im_result = np.zeros((img.shape))
# print(nb_blobs, sizes )
# print(im_with_separated_blobs)
# Image.fromarray(im_with_separated_blobs).save('./mid.png')
# # for every component in the image, keep it only if it's above min_size
# for blob in range(nb_blobs):
#     if sizes[blob] >= min_size:
#         print('here', im_with_separated_blobs == blob + 1)
#         # see description of im_with_separated_blobs above
#         im_result[im_with_separated_blobs == blob + 1] = 255

# print(im_result)
# img = Image.fromarray(im_result).convert(mode='L').point(fn, mode='1')
# img.save('./123.png')