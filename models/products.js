import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: String,
        },
        currency: {
            type: Date,
            default: Date.now,
        },
        stock: {
            type: Number,
            default: 0,
        },
        availability: {
            type: String,

        },
        internalId: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("products", ProductSchema);
Product.createIndexes(); // this is done so remove duplicacy when uniqueness is provided
export default Product;