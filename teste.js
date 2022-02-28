const arr = [
    {
      buyQty: '2',
      product: {
        _id: '62065ac2820eea6eba380207',
        name: 'Orange',
        price: 0.99,
        unity: 'Kg',
        inStock: 10,
        category: 'fruit',
        store: '6202e2e410c4eb2c82fd3db1',
        __v: 0
      }
    },
    {
      buyQty: '6',
      product: {
        _id: '62065a8e820eea6eba3801e1',
        name: 'Apple ',
        price: 0.99,
        unity: 'Kg',
        inStock: 15,
        category: 'fruit',
        store: '6203ede94105a2bf24d6d821',
        __v: 0
      }
    }
  ]
  
const arr2 = {
  buyQty: '6',
  product: {
    _id: '62065a8e820eea6eba3801e1',
    name: 'Apple ',
    price: 0.99,
    unity: 'Kg',
    inStock: 15,
    category: 'fruit',
    store: '6203ede94105a2bf24d6d821',
    __v: 0
  }
}

const id = '62065ac2820eea6eba380207'
const check = (arr) => {
    
    if(arr.length !== 0) {
        for(let item of arr) {
            if(id === item.product._id) {   
             item.buyQty+= 2
                return arr
            } else{
                arr.push({
                        buyQty: 10,
                        product: {
                          _id: '624104040040065a8e820eea6eba3801e1',
                          name: 'banana ',
                          price: 0.99,
                          unity: 'Kg',
                          inStock: 15,
                          category: 'fruit',
                          store: '6203ede94105a2bf24d6d821',
                          __v: 0
                        } 
                });
                return arr
            }
    }  
    } else{
        arr.push({
                buyQty: 10,
                product: {
                  _id: '624104040040065a8e820eea6eba3801e1',
                  name: 'watermelon ',
                  price: 0.99,
                  unity: 'Kg',
                  inStock: 15,
                  category: 'fruit',
                  store: '6203ede94105a2bf24d6d821',
                  __v: 0
                } 
        });
        return arr
    }
    
}

// console.log(check([
//     {
//       buyQty: 2,
//       product: {
//         _id: '62065ac2820eea6eba380207',
//         name: 'Orange',
//         price: 0.99,
//         unity: 'Kg',
//         inStock: 10,
//         category: 'fruit',
//         store: '6202e2e410c4eb2c82fd3db1',
//         __v: 0
//       }
//     },
//     {
//       buyQty: 6,
//       product: {
//         _id: '62065a8e820eea6eba3801e1',
//         name: 'Apple ',
//         price: 0.99,
//         unity: 'Kg',
//         inStock: 15,
//         category: 'fruit',
//         store: '6203ede94105a2bf24d6d821',
//         __v: 0
//       }
//     }
//   ]))

  const checkProduct = arr.findIndex(obj => obj.product._id === arr2.product._id)

  if(checkProduct === -1) {
      console.log("not same")
  } else{
    console.log('same id')
  }

