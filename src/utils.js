
export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

export const calcDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const areColliding = (objectOne, objectTwo) =>
    (objectOne.x + objectOne.width >= objectTwo.x && objectOne.x + objectOne.width <= objectTwo.x + objectTwo.width)
    && ((objectOne.y + objectOne.height >= objectTwo.y && objectOne.y + objectOne.height <= objectTwo.y + objectTwo.height)
    || (objectOne.y >= objectTwo.y && objectOne.y <= objectTwo.y + objectTwo.height));
