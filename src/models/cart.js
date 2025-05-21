import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type:[
            {
                id_prod: {
                    type: Schema.Types.ObjectId, 
                    required: true,
                    ref: 'Product'},
                quantity: {
                    type: Number,
                    required: true, 
                    default: 1}
            }
        ],
        default: []
    }
})

cartSchema.pre('findOne', function(){
    this.populate('products.id_prod')
}
)

const cartModel = model("carts", cartSchema)

export default cartModel;