export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

export const calcDistance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};


