import React, { useState } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";

interface FlavorType {
    id: number;
    name: string;
}

interface FoodPairingType {
    id: number;
    name: string;
}

interface AISummaryType {
    id: number;
    text: string;
};

interface ProductType {
    id: number;
    name: string;
    ai_summaries: AISummaryType[];
    flavors: FlavorType[];
    food_pairings: FoodPairingType[];
};

const GET_ALL_PRODUCTS = gql`
    query GetAllProducts {
        getAllProducts {
            id
            name
            ai_summaries {
                id
                text
            }
            flavors {
                id
                name
            }
            food_pairings {
                id
                name
            }
        }
    }
`;

const GET_IMAGE = gql`
    query GetProductImage($promptId: ID!) {
        getProductImage(promptId: $promptId) {
            image
            prompt_id
    }
}
`


export default function Products(): React.ReactElement {
    const [products, setProducts] = useState<ProductType[]>([]);

    const { loading, error } = useQuery(GET_ALL_PRODUCTS, {
        onCompleted: (data : { getAllProducts: ProductType[]}) => {
            if (data && data.getAllProducts) {
                setProducts(data.getAllProducts);
            };
        },
        pollInterval: 0,
    });

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error.message}</p>
    if (!products || products.length < 1)return <p>No products to display!</p>
    
    return (
        <div className="products-container">
            {products.map((product: ProductType) => (
                <Product key={product.id} product={product}/>
            ))}
        </div>
    )
};






// Individual product component
function Product({ product }: { product: ProductType }): React.ReactElement {
    const [isAiExpanded, setIsAiExpanded] = useState<boolean>(false);
    const [productImage, setProductImage] = useState<string>("");

    const [getProductImage, { error, loading }] = useLazyQuery(GET_IMAGE, {
        onCompleted: (data)=>{
            if (data && data.getProductImage){
                const image: string = `${data.getProductImage.image}`
                setProductImage(image)
            }
        }
    });

    const handleImage = (promptId: number): void => {
        getProductImage({
            variables: {
                promptId: promptId
            }
        });
        
    };

    function titleCase(str: string): string {
        return str.toLowerCase().split(' ').map(function(word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
    
    if (!product) return <li>Loading product...</li>;
    
   
    const flavorElements: React.ReactElement[] = product.flavors?.map((flavor: FlavorType): React.ReactElement => (
        <div key = {flavor.id} className="flavor-button">   
            <p className="flavor">{flavor.name}</p>
        </div>
    ))
    
    const flavorPairings: React.ReactElement[] = product.food_pairings?.map((foodPairing: FoodPairingType): React.ReactElement => (
        <div key = {foodPairing.id} className="foodPairing-button">   
            <p className="foodPairing-button">{foodPairing.name}</p>
        </div>
    ))

    // const summaryIndex: number = product.ai_summaries.length > 0 ? 
    //     Math.floor(Math.random() * product.ai_summaries.length) : 0;
    const productSummary: AISummaryType = product.ai_summaries[product.ai_summaries.length - 1];

    return (
        <div className="product" key = {product.id}>
            <div className="product-header">
                <span className="product-flag">🇺🇸</span>
                <h3 className="product-title"> {titleCase(product.name)}</h3>
            </div>
            <div>
                <div className="product-flavors">
                    {flavorElements.slice(0,5)}
                </div>
            </div>
            <div className="product-buttons">
                {!productImage ? 
                    loading ?  <img className="product-image" src="/loading.gif"/> : <button onClick={()=>handleImage(productSummary.id)}>Visualize</button>
                    : 
                    error ? <button onClick={()=>handleImage(productSummary.id)}>Try Again</button> : <img className="product-image" src={productImage} alt={product.name + " - " + productSummary.text}/>
                }
                {!isAiExpanded ?
                    <button className="button-2" onClick={()=>setIsAiExpanded(!isAiExpanded)}>Description</button> :
                    <p className = "description-close" onClick={()=>setIsAiExpanded(!isAiExpanded)}>close description</p>
                }
            </div>
            <div>
                {isAiExpanded && 
                    <>
                        <div className="product-foodPairings">
                            {flavorPairings.slice(0,5)}
                        </div>
                        <div className="description-container">
                            <p className="product-description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{productSummary.text}</p>
                        </div>
                    </> 
                }
            </div>
        </div>
    )
};