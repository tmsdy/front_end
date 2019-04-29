function binary_search(arr, key) {
    let low = 0
    let high = arr.length-1

    while(low < high){
        let mid = Math.floor((high+low)/2)
        if(arr[mid]==key) return mid
        if(arr[mid]<key){
            low = mid
        }
        if(arr[mid]>key){
            high = mid
        }
    }
    return -1
};
var arr = [1,2,3,4,5,6,7,8,9,10,11,23,44,86];
var result = binary_search(arr,-11);
console.log(result); 