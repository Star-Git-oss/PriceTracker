"use server"
import { revalidatePath } from 'next/cache';

import Product from '../models/product.module';
import { connectToDB } from '../mongoose';
import {scrapeAmazonProduct} from '../scrapper/index'
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { generateEmailBody, sendEmail } from '../nodemailer';
import { User } from '@/types';

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) return;

    try{
        connectToDB();
        const scrappedProduct = await scrapeAmazonProduct(productUrl);
        
        if(!scrappedProduct) return;
        let product =scrappedProduct;
        const existingProduct = await Product.findOne({url: scrappedProduct.url})

        if(existingProduct){

            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                {price: scrappedProduct.currentPrice}
            ]

            product = {
                ...scrappedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),


            }
        }
        const newProduct = await Product.findOneAndUpdate({
            url: scrappedProduct.url
        },
            product,
            {upsert: true, new:true}
        );

        revalidatePath(`/product/${newProduct._id}`);

    }catch(error: any){
    throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export async function getProductById(productId: string){
    try{
    connectToDB();

    const product = await Product.findOne({_id: productId});

    if(!product) return null;
    return product;
} catch(error){
    console.log(error);
}
}

export async function getAllProducts(){
    try{
        connectToDB();
        const products = await Product.find();

        return products;
    }catch(error){
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string){
    try{
        connectToDB();
        const currentProduct = await Product.findById(productId);

        if(!currentProduct) return null;
        const similarProducts = await Product.find({
            _id:{$ne: productId},
        }).limit(3);
        

        return similarProducts;
        
    }catch(error){
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId:string, userEmail:string){
    try{
        const product= await Product.findById(productId);

        if(!product) return;

        const userExits = product.users.some((user: User) => user.email===userEmail);
    
        if(!userExits){
            product.users.push({email: userEmail});

            await product.save();
            const emailContent = await generateEmailBody(product, "WELCOME");

            await sendEmail(emailContent, [userEmail]);
        }
    }
        catch(error){
            console.log(error);
        }
    }

