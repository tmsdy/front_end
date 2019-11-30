let arr = [8, 4, 26, 17, 12, 3, 222, 33];
quickSort(arr, 0, arr.length - 1)
console.log(arr);

function quickSort(arr, l, r) {
    if (l >= r) return arr;

    let p = partition(arr, l, r);
    quickSort(arr, l, p - 1);
    quickSort(arr, p + 1, r);

    return arr;
}
function partition(arr, l, r) {
    let midV = arr[l];
    let p = l;
    for (let i = l + 1; i <= r; i++) {
        if (arr[i] < midV) {
            swap(arr, p + 1, i);
            p++;
        }
    }
    swap(arr, p, l);
    return p;
}
function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}