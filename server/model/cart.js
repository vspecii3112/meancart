module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id, itemQty) {
        var storedItem = this.items[id];        //checks if the item ID already exist
        if (!storedItem) {  //creates new cart item if item does not exist
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty = storedItem.qty + itemQty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty += itemQty;
        this.totalPrice += storedItem.item.price * itemQty;
    };

    //this function will remove a single item from the shopping cart
    this.reduceByOne = function(id) {
        this.items[id].qty--;       //reduce the item quantity by 1
        this.items[id].price -= this.items[id].item.price;      //reduce the total price of the single item by the item price
        this.totalQty--;        //reduce the total quantity by 1
        this.totalPrice -= this.items[id].item.price;       //reduce the total price of the shopping cart by the item price

        if (this.items[id].qty <= 0) {
            delete this.items[id];      //delete the item if the quantity reaches 0
        }
    };

    //this function will remove the entire single item from the shopping cart
    this.removeAll = function(id) {
        this.totalQty -= this.items[id].qty;        //reduce by the total quantity of the item
        this.totalPrice -= this.items[id].price;    //reduce by the total price of the item
        delete this.items[id];      //delete the item
    };

    //this function will update the item quantity and price
    this.updateCart = function(id, itemQty) {
        this.items[id].qty = itemQty;           //updates the item quantity
        this.items[id].price = this.items[id].item.price * itemQty;     //calculates the total price of the item and updates the price
    }
    
    this.generateArray = function() {       //puts the cart into an array
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};