import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import React from "react";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import {Button, Grid, IconButton, List, ListItemButton, ListItemSecondaryAction, ListItemText} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {
    country_arr,
    getURLParamValue,
    imageToByteArrayMap,
    isEditMode,
    isViewMode
} from "Frontend/components/commonHelperFunctions";
import {pickupLocationApi, productApi} from "Frontend/api/ApiCalls";
import {useOutletContext} from "react-router-dom";
import {
    GetProductCategoryResponseModel, Product,
    ProductCategory,
    ProductCondition, ProductReview, ProductReviewResponseModel, ProductsResponseModel
} from "Frontend/api/Models/CarrierModels/Product";
import {RichTextEditorRef} from "mui-tiptap";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {productUrls} from "Frontend/api/Endpoints";
import { PickupLocation } from "Frontend/api/Models/CarrierModels/PickupLocation";
import { parseISO } from "date-fns";
import {PaginatedGridInterface} from "Frontend/components/Datagrid/CustomPaginationForGrid";
import ReviewSection from "Frontend/views/Product/Components/ReviewSection";
import MuiPagination from "@mui/material/Pagination";
import {AutocompleteInputChangeReason} from "@mui/base/useAutocomplete/useAutocomplete";

const paginatedGridModel: PaginatedGridInterface = {
    start: 0,
    end: 10,
    pageSize: 10,
    includeDeleted: false,
    data: [],
    totalPaginationBlockCount: 0,
    actualDataCount: 0,
    filterExpr: {
        columnName: "",
        condition: "",
        filterText: ""
    }
}

const AddEditProduct = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // products
    const [title, setTitle] = React.useState<string>("");
    const [productCategory, setProductCategory] = React.useState<string>();
    const [descriptionHtml, setDescriptionHtml] = React.useState<string>("");
    const [modificationDescriptionHtml, setModificationDescriptionHtml] = React.useState<string>("");
    const [condition, setCondition] = React.useState<number>(1);
    const [brand, setBrand] = React.useState<string>("");
    const [model, setModel] = React.useState<string>("");
    const [pickupLocationId, setPickupLocationId] = React.useState<number>();
    const [countryOfManufacture, setCountryOfManufacture] = React.useState<string>("");
    const [color, setColor] = React.useState<string>("");
    const [colorLabel, setColorLabel] = React.useState<string>("");
    const [upc, setUpc] = React.useState<string>("");
    const [length, setLength] = React.useState<number>(0.0);
    const [breadth, setBreadth] = React.useState<number>(0.0);
    const [height, setHeight] = React.useState<number>(0.0);
    const [weight, setWeight] = React.useState<number>(0.0);
    const [price, setPrice] = React.useState<number>(0.0);
    const [discount, setDiscount] = React.useState<number>(0.0);
    const [availableStock, setAvailableStock] = React.useState<number>(0.0);
    const [returns, setReturns] = React.useState<string>("Yes");
    const [discountPercent, setDiscountPercent] = React.useState<string>("");
    const [itemModified, setItemModified] = React.useState<string>("No");
    const [itemAvailableFrom, setItemAvailableFrom] = React.useState<Date>(new Date());
    const [formData, setFormData] = React.useState<FormData>(new FormData());

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>(null);
    const rteRefModification = React.useRef<RichTextEditorRef>(null);
    const rteRefReview = React.useRef<RichTextEditorRef>(null);

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");
    const [dense, setDense] =  React.useState<boolean>(false);
    const [listItems, setListItems] = React.useState<ProductCategory[]>([]);
    const [colors, setColors] = React.useState<Map<string, string>[]>([]);
    const [pickupLocations, setPickupLocations] = React.useState<PickupLocation[]>([]);
    const [categoryStack, setCategoryStack] = React.useState<string[]>([]);

    // state variables for product review
    const [review, setReview] = React.useState<string>("");
    const [rating, setRating] = React.useState<number>(0.0);
    const [state, setState] = React.useState<PaginatedGridInterface>(paginatedGridModel);
    const [subComments, setSubComments] = React.useState<any>({});
    const [userIdFullNameMapping, setUserIdFullNameMapping] = React.useState<any>({});
    const [imageBase64Mapping, setImageBase64Mapping] = React.useState<any>({});

    // local variables
    const isEdit = isEditMode("productId");
    const isView = isViewMode("productId");
    let productId = (isEdit || isView) ? parseInt(getURLParamValue("productId") as string) : null;
    const imageKeys = [
        "Main", "Top", "Bottom", "Front", "Back",
        "Right", "Left", "Detail", "Defect",
        "Additional_1", "Additional_2", "Additional_3"
    ];

    // select list or navigate to next list when clicked on product category list
    const handleListItemClick = (productCategory: string, isEnd: boolean) => {
        productApi(setLoading).setProductCategory(productCategory)
            .then((_) => {
            if(isEnd) {
                let tempList: ProductCategory[] = [];
                for (let i = 0; i < listItems.length; i++) {
                    if (listItems[i].name == productCategory) {
                        listItems[i].isSelected = true;
                        tempList.push(listItems[i]);
                    } else {
                        tempList.push(listItems[i]);
                    }
                }

                setListItems(tempList);
                setProductCategory(productCategory);
            }
            else {
                setProductCategory("");
                categoryStack.push(productCategory);
                setCategoryStack(categoryStack);

                // axios call to get the next list
                productApi(setLoading).getProductCategories()
                    .then((response: GetProductCategoryResponseModel) => {
                        setListItems(response.productCategories)
                    });
            }
        });
    };

    // handle back click on product categrory list
    const goBackInCategories = () => {
        if (categoryStack.length > 0) {
            categoryStack.pop();
            setCategoryStack(categoryStack);

            if (categoryStack.length == 0) {
                handleListItemClick("root", false);
            } else {
                handleListItemClick(categoryStack.pop() as string, false);
                setCategoryStack(categoryStack);
            }
        }
        return;
    };

    const handleImageUpload = (event: any) => {
        // open image
        document.getElementById(event.target.id + "Input")?.click();

        // save image to form data
        //--> done in file upload change

        // load image to div
        //-->done in file upload change
    };

    const fileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const ImageId = fileInput.id.replace("Input", "");
        const file = fileInput.files?.[0];

        if (file) {
            formData.append(ImageId, file);
            const imageElement = document.getElementById(ImageId) as HTMLImageElement;
            if (imageElement) {
                imageElement.src = URL.createObjectURL(file);
            }
            setFormData(formData);
        }
    };

    const removeFile = () => {
        // Reset form data
        setFormData(new FormData());

        // Reset each image and input field
        imageKeys.forEach((imageKey) => {
            const imageElement = document.getElementById(imageKey) as HTMLImageElement | null;
            const inputElement = document.getElementById(imageKey + "Input") as HTMLInputElement | null;

            if (imageElement) {
                imageElement.src = productUrls.getStaticImage + `?imageName=${imageKey.includes("Additional") ? "Blank.png" : imageKey + ".png"}`;
            }
            if (inputElement) {
                inputElement.value = "";
            }
        });
    };

    const handleSubmit = () => {
        setLoading(true);
        let requestData: Product = {
            // Product
            productId: productId ? productId : undefined,
            title: title,
            descriptionHtml: rteRef.current?.editor?.getHTML() ?? "",
            category: productCategory as string,

            // Product details
            condition: condition,
            brand: brand,
            model: model,
            countryOfManufacture: countryOfManufacture,
            color: color,
            colorLabel: colorLabel,
            upc: upc,
            itemModified: itemModified == "Yes",
            modificationHtml: rteRefModification.current?.editor?.getHTML() ?? "",

            // Product pricing and sizing
            length: length,
            breadth: breadth,
            height: height,
            weightKgs: weight,
            price: price,
            discount: discount,
            discountPercent: discountPercent == "Yes",

            // Misc information
            pickupLocationId: pickupLocationId as number,
            returnsAllowed: returns == "Yes",
            availableStock: availableStock,
            itemAvailableFrom: itemAvailableFrom,
            notes: notes
        }

        let images = new Map<string, File | undefined>();
        let byteArrayMap: Map<string, string> = new Map<string, string>();

        imageKeys.forEach(key => {
            const formDataImage = formData.has(key) ? formData.get(key) : undefined;
            if (formDataImage instanceof File) {
                images.set(key, formDataImage);
            } else if (isEdit) {
                if(imageBase64Mapping.hasOwnProperty(key) &&
                    imageBase64Mapping[key] != "" &&
                    imageBase64Mapping[key] != null) {
                    byteArrayMap.set(key, imageBase64Mapping[key] as string);
                }
            }
        });

        imageToByteArrayMap(images)
            .then((response: Map<string, string>) => {
                // Merge byteArrayMap and response
                if (byteArrayMap.size > 0) {
                    byteArrayMap.forEach((value, key) => {
                        if(!response.get(key)) {
                            response.set(key, value);
                        }
                    });
                }

                if(isEdit) {
                    productApi(setLoading).editProduct(requestData, response).then(() => {});
                }
                else {
                    productApi(setLoading).addProduct(requestData, response).then(() => {});
                }
            });
    }

    const handleFetchProductCategories = () => {
        productApi(setLoading).getProductCategories()
            .then((response: GetProductCategoryResponseModel) => {
                setCategoryStack(response.allParents);
                if (response.end) {
                    let TempList = [];
                    for (let i = 0; i < response.productCategories.length; i++) {
                        if (response.productCategories[i].name == response.selectedText) {
                            response.productCategories[i].isSelected = true;
                            TempList.push(response.productCategories[i]);
                        } else {
                            TempList.push(response.productCategories[i]);
                        }
                    }

                    setListItems(TempList);
                    setProductCategory(response.selectedText);
                } else {
                    setListItems(response.productCategories);
                }
            });
    }

    const handleFetchProductDetailsById = (productId: number) => {
        productApi(setLoading).getProductDetailsByIds([productId])
            .then((response: ProductsResponseModel[]) => {
                let product = response[0].product;
                let productCategory = response[0].productCategory;

                // set the product information
                setTitle(product.title ?? "");
                setDescriptionHtml(product.descriptionHtml ?? "");
                const proseMirrorDiv = document.querySelectorAll('.ProseMirror');
                if(proseMirrorDiv.length >= 1 && proseMirrorDiv[0] != null) {
                    proseMirrorDiv[0].innerHTML = product.descriptionHtml ?? "";
                }

                // set the product category
                productApi(setLoading).setProductCategory(productCategory.name)
                    .then((_: boolean) => {
                        handleFetchProductCategories();
                    })

                // set the product details
                setCondition(product.condition as number);
                setBrand(product.brand ?? "");
                setModel(product.model ?? "");
                setCountryOfManufacture(product.countryOfManufacture ?? "");
                setColor(product.color ?? "");
                setColorLabel(product.colorLabel ?? "");
                setUpc(product.upc ?? "");
                setItemModified(product.itemModified ? "Yes" :"No");
                setModificationDescriptionHtml(product.modificationHtml ?? "");
                if(proseMirrorDiv.length >= 2 && proseMirrorDiv[1] != null) {
                    proseMirrorDiv[1].innerHTML = product.modificationHtml ?? "";
                }

                // set the product pricing
                setLength(product.length ?? 0.0);
                setBreadth(product.breadth ?? 0.0);
                setHeight(product.height ?? 0.0);
                setWeight(product.weightKgs ?? 0.0);
                setPrice(product.price ?? 0.0);
                setDiscount(product.discount ?? 0.0);
                setDiscountPercent(product.discountPercent ? "Yes" : "No");

                // set misc information
                setPickupLocationId(product.pickupLocationId);
                setReturns(product.returnsAllowed ? "Yes" : "No");
                setAvailableStock(product.availableStock ?? 0);
                setItemAvailableFrom(product.itemAvailableFrom ?? new Date());
                setNotes(product.notes ?? "");

                // set the images
                const imageIds= {
                    "Main": product.mainImage,
                    "Top": product.topImage,
                    "Bottom": product.bottomImage,
                    "Front": product.frontImage,
                    "Back": product.backImage,
                    "Right": product.rightImage,
                    "Left": product.leftImage,
                    "Detail": product.detailsImage,
                    "Defect": product.defectImage,
                    "Additional_1": product.additionalImage1,
                    "Additional_2": product.additionalImage2,
                    "Additional_3": product.additionalImage3
                };

                Object.entries(imageIds).forEach(([key, imageId]) => {
                    const imageElement = document.getElementById(key) as HTMLImageElement | null;
                    const inputElement = document.getElementById(key + "Input") as HTMLInputElement | null;

                    // Reset the image source and input value
                    if(imageId) {
                        if (imageElement) {
                            imageElement.src = productUrls.getProductImage + `?imageName=${imageId}`;
                        }
                        if (inputElement) {
                            inputElement.value = "";
                        }
                    }
                });

                setImageBase64Mapping(response[0].imageBase64Mapping);
            });
    }

    const handleFetchProductReviews = (paginationRequestModel: PaginatedGridInterface) => {
        productApi(setLoading).getProductReviewsGivenProductId({
            columnName: "",
            condition: "",
            filterExpr: "",
            start: paginationRequestModel.start,
            end: paginationRequestModel.end,
            pageSize: state.pageSize,
            includeDeleted: false,
        }, productId as number)
            .then((response: ProductReviewResponseModel) => {
                let data;
                if (response.productReviewMap instanceof Map) {
                    // Convert the Map values to an array
                    data = Array.from(response.productReviewMap.values());
                }
                else{
                    data = Object.values(response.productReviewMap);
                }

                setSubComments(response.productReviewTree);
                setUserIdFullNameMapping(response.userIdFullNameMapping);
                setState({
                    ...state,
                    data: data,
                    totalPaginationBlockCount: Math.ceil(
                        response.totalRootComments / state.pageSize
                    ),
                    includeDeleted: false,
                    actualDataCount: response.totalRootComments,
                    start: paginationRequestModel.start,
                    end: paginationRequestModel.end,
                    filterExpr: {
                        columnName: "",
                        condition: "",
                        filterText: "",
                    }
                });
            });
    }

    const handleAddProductReview = () => {
        productApi(setLoading).insertProductReview({
            review: rteRefReview.current?.editor?.getHTML() ?? "",
            ratings: rating,
            productId: productId
        } as ProductReview)
            .then((reviewId: number) => {
                productApi(setLoading).getProductReviewById(reviewId)
                    .then((response: ProductReviewResponseModel) => {
                        //Step 1: Update the comments state
                        setState((prevState: PaginatedGridInterface) => {
                            // Extract existing comments from state.data
                            const existingComments = prevState.data || [];

                            // Add new comment to the existing comments
                            const updatedComments = [...existingComments, response.productReview];

                            // Return updated state with the new comments list
                            return {
                                ...prevState,
                                data: updatedComments
                            };
                        });

                        // Step 2: Update the userIdFullNameMapping state
                        setUserIdFullNameMapping((prevMapping: { [key: number]: string }) => {
                            const { userId, firstName, lastName } = response.user;
                            const fullName = `${firstName} ${lastName}`;

                            // Add user only if userId is not already in the mapping
                            if (prevMapping[userId as number]) {
                                return prevMapping;
                            }

                            return {
                                ...prevMapping,
                                [userId as number]: fullName
                            };
                        });

                        // Get the element by ID and scroll to the bottom
                        const reviewSection = document.getElementById('reviewSection');
                        if (reviewSection) {
                            requestAnimationFrame(() => {
                                reviewSection.scrollTop = -reviewSection.scrollHeight;
                            });
                        }

                        // clear the ratings and the editor
                        const parentDiv = document.querySelector('#insertEditor');
                        if(parentDiv){
                            const proseMirrorDiv = parentDiv.querySelectorAll('.ProseMirror');
                            if(proseMirrorDiv && proseMirrorDiv[0] != null) {
                                proseMirrorDiv[0].innerHTML = "";
                            }
                        }
                        setRating(0.0);
                    });
            });

    }

    React.useEffect(() => {
        // get the product category types
        productApi(setLoading).getColors()
            .then((response: Map<string, string>[]) => {
                setColors(response);
            });

        pickupLocationApi(setLoading).getAllPickupLocations()
            .then((response: PickupLocation[]) => {
                setPickupLocations(response);
            });

        if(isEdit || isView) {
            handleFetchProductDetailsById(productId as number);
            handleFetchProductReviews(paginatedGridModel);
        }
        else{
            handleFetchProductCategories();
        }
    }, []);


    return(
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="Product"
                sectionSubTitle="What are we selling?"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Title"
                        value={title}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value), [title])}
                        isView={isView}
                    />
                </Grid>

                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.RichTextArea}
                        rteRef={rteRef}
                        label="Product Description"
                        isView={isView}
                        value={descriptionHtml}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Product Category"
                sectionSubTitle="Categorize your product out of these major categories"
            >
                <Grid item md={12} xs={12}>
                    <div
                        style={{
                            width: "100%",
                            height: "400px",
                            overflowY: "scroll",
                        }}
                    >
                        <List dense={dense}>
                            {listItems.map(function (item: ProductCategory, i:number) {
                                return (
                                    <ListItemButton
                                        key={i}
                                        onClick={() => handleListItemClick(item.name, item.end)}
                                        divider={true}
                                        disabled={isView}
                                        selected={item.isSelected}
                                    >
                                        <ListItemText primary={item.name}/>
                                        <ListItemSecondaryAction>
                                            {!item.end ? (
                                                <IconButton edge="end" aria-label="delete">
                                                    <FontAwesomeIcon icon={faArrowRight} size="xs"/>
                                                </IconButton>
                                            ) : (
                                                <></>
                                            )}
                                        </ListItemSecondaryAction>
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </div> <br/>
                    {
                        !isView ?
                            <Button onClick={() => goBackInCategories()}>
                                <FontAwesomeIcon icon={faArrowLeft} size="xs"/>&nbsp;&nbsp;Back
                            </Button>
                            : <></>
                    }
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Product Details"
                sectionSubTitle="More about the product"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="Condition"
                        value={condition}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCondition(parseInt(event.target.value)), [condition])}
                        isView={isView}
                        data={[
                            {
                                key: "New With Tags",
                                value: ProductCondition.NEW_WITH_TAGS.toString(),
                                title: "New With Tags"
                            },
                            {
                                key: "New Without Tags",
                                value: ProductCondition.NEW_WITHOUT_TAGS.toString(),
                                title: "New Without Tags"
                            },
                            {
                                key: "New With Defects",
                                value: ProductCondition.NEW_WITH_DEFECTS.toString(),
                                title: "New With Defects"
                            },
                            {key: "Pre-Owned", value: ProductCondition.PRE_OWNED.toString(), title: "Pre-Owned"},
                            {
                                key: "Pre-Owned with Defects",
                                value: ProductCondition.PRE_OWNED_WITH_DEFECTS.toString(),
                                title: "Pre-Owned with Defects"
                            },
                        ]}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Brand"
                        value={brand}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setBrand(event.target.value), [brand])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Model"
                        value={model}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setModel(event.target.value), [model])}
                        isView={isView}
                        required={false}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="Country of manufacture"
                        value={countryOfManufacture}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setCountryOfManufacture(event.target.value), [countryOfManufacture])}
                        isView={isView}
                        data={country_arr.map((country: string) => ({
                            key: country,
                            value: country,
                            title: country
                        } as DataItem))}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.AutoCompleteDropdown}
                        label="Color"
                        value={{ label: colorLabel, id: color }}
                        handleChange={React.useCallback((
                            event: React.SyntheticEvent<Element, Event>,
                            value: { label: string | undefined; id: string | undefined },
                            reason: string
                        ) => {
                            setColor(value.id as string);
                            setColorLabel(value.label as string);
                        }, [color, colorLabel, colors])}
                        isView={isView}
                        autoCompleteOptions={colors}
                        onInputChange={React.useCallback((
                            event: React.SyntheticEvent<Element, Event>,
                            value: string,
                            reason: AutocompleteInputChangeReason
                        ) => {
                            setColorLabel(value);
                        }, [color, colorLabel, colors])}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="UPC"
                        value={upc}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setUpc(event.target.value), [upc])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Radio}
                        label="Item Modified?"
                        value={itemModified}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setItemModified(event.target.value), [itemModified])}
                        isView={isView}
                        data={[
                            {
                                title: "Yes",
                                value: "Yes",
                                key: "Yes"
                            },
                            {
                                title: "No",
                                value: "No",
                                key: "No"
                            }
                        ]}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.RichTextArea}
                        rteRef={rteRefModification}
                        label="Modification Description"
                        isView={isView}
                        value={modificationDescriptionHtml}
                        required={itemModified == "Yes"}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Product pricing and sizing"
                sectionSubTitle="Set the prices of the product"
            >
                <Grid item md={6} xs={12}>
                    <Grid container justifyContent="left" spacing={2}>
                        <Grid key="1" item md={4} xs={12}>
                            <RenderInput
                                inputType={InputType.AmountField}
                                label="Length"
                                value={length}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLength(parseFloat(event.target.value)), [length])}
                                isView={isView}
                                prefix="In"
                                thousandSeparator={false}
                            />
                        </Grid>
                        <Grid key="2" item md={4} xs={12}>
                            <RenderInput
                                inputType={InputType.AmountField}
                                label="Breadth"
                                value={breadth}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setBreadth(parseFloat(event.target.value)), [breadth])}
                                isView={isView}
                                prefix="In"
                                thousandSeparator={false}
                            />
                        </Grid>
                        <Grid key="3" item md={4} xs={12}>
                            <RenderInput
                                inputType={InputType.AmountField}
                                label="Height"
                                value={height}
                                handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setHeight(parseFloat(event.target.value)), [height])}
                                isView={isView}
                                prefix="In"
                                thousandSeparator={false}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.AmountField}
                        label="Weight in kgs"
                        value={weight}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setWeight(parseFloat(event.target.value)), [weight])}
                        isView={isView}
                        prefix="Kg"
                        thousandSeparator={false}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.AmountField}
                        label="Price"
                        value={price}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPrice(parseFloat(event.target.value)), [price])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.AmountField}
                        label="Discount"
                        value={discount}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDiscount(parseFloat(event.target.value)), [discount])}
                        isView={isView}
                        prefix={discountPercent == "Yes" ? "%" : "₹"}
                        thousandSeparator={discountPercent != "Yes"}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Radio}
                        label="Is Discount in Percent?"
                        value={discountPercent}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDiscountPercent(event.target.value), [discountPercent])}
                        isView={isView}
                        data={[
                            {
                                title: "Yes",
                                value: "Yes",
                                key: "Yes"
                            },
                            {
                                title: "No",
                                value: "No",
                                key: "No"
                            }
                        ]}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Misc Information"
                sectionSubTitle="Some more details"
            >
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Dropdown}
                        label="Pickup Location"
                        value={pickupLocationId?.toString()}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPickupLocationId(parseInt(event.target.value)), [pickupLocationId, pickupLocations])}
                        isView={isView}
                        data={pickupLocations.map((pickupLocation: PickupLocation) => ({
                            key: pickupLocation.addressNickName,
                            value: pickupLocation.pickupLocationId?.toString(),
                            title: pickupLocation.addressNickName
                        } as DataItem))}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Radio}
                        label="Returns allowed?"
                        value={returns}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setReturns(event.target.value), [returns])}
                        isView={isView}
                        data={[
                            {
                                title: "Yes",
                                value: "Yes",
                                key: "Yes"
                            },
                            {
                                title: "No",
                                value: "No",
                                key: "No"
                            }
                        ]}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Available Stock"
                        value={availableStock}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setAvailableStock(parseInt(event.target.value)), [availableStock])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <RenderInput
                        inputType={InputType.Date}
                        label="Item Available From"
                        value={itemAvailableFrom}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setItemAvailableFrom(parseISO(event.target.value)), [itemAvailableFrom])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextArea}
                        label="Notes"
                        value={notes}
                        required={false}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNotes(event.target.value), [notes])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Product Images"
                sectionSubTitle="product images"
            >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={3}>
                        {["Main", "Top", "Bottom", "Front"].map((imageId) => (
                            <Grid key={imageId} item>
                                <img
                                    id={imageId}
                                    onClick={handleImageUpload}
                                    style={{
                                        border: "2px dotted black",
                                        height: 140,
                                        width: 150,
                                    }}
                                    src={productUrls.getStaticImage+ `?imageName=${imageId + ".png"}`}
                                    alt={""}
                                />
                                {
                                    !isView ?
                                        <input
                                            accept="image/*"
                                            type="file"
                                            id={imageId + "Input"}
                                            style={{width: 0, height: 0, overflow: "hidden"}}
                                            onChange={fileUploadChange}
                                        /> : <></>
                                }
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={3}>
                        {["Back", "Right", "Left", "Detail"].map((imageId) => (
                            <Grid key={imageId} item>
                                <img
                                    id={imageId}
                                    onClick={handleImageUpload}
                                    style={{
                                        border: "2px dotted black",
                                        height: 140,
                                        width: 150,
                                    }}
                                    src={productUrls.getStaticImage+ `?imageName=${imageId + ".png"}`}
                                    alt={""}
                                />
                                {
                                    !isView ?
                                        <input
                                            accept="image/*"
                                            type="file"
                                            id={imageId + "Input"}
                                            style={{width: 0, height: 0, overflow: "hidden"}}
                                            onChange={fileUploadChange}
                                        /> : <></>
                                }
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={3}>
                        {["Defect", "Additional_1", "Additional_2", "Additional_3"].map((imageId) => (
                            <Grid key={imageId} item>
                                <img
                                    id={imageId}
                                    onClick={handleImageUpload}
                                    style={{
                                        border: "2px dotted black",
                                        height: 140,
                                        width: 150,
                                    }}
                                    src={productUrls.getStaticImage+ `?imageName=${(imageId != "Defect" ? "Blank" : imageId) + ".png"}`}
                                    alt={""}
                                />
                                {
                                    !isView ?
                                        <input
                                            accept="image/*"
                                            type="file"
                                            id={imageId + "Input"}
                                            style={{width: 0, height: 0, overflow: "hidden"}}
                                            onChange={fileUploadChange}
                                        /> : <></>
                                }
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                {
                    !isView ?
                        <>
                            <br/>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center" spacing={3}>
                                    <Grid key="Main" item>
                                        <BlueButton
                                            label="Remove Images"
                                            handleSubmit={removeFile}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </> : <></>
                }
            </SectionLayout><br/>

            {
                isEdit || isView ?
                    <>
                        <SectionLayout
                            sectionTitle="Product Reviews"
                            sectionSubTitle="User reviews for the product"
                        >
                            {
                                isEdit || isView ?
                                    <>
                                        <Grid item md={12} xs={12}>
                                            <ReviewSection
                                                comments={state.data}
                                                setComment={React.useCallback((comments: ProductReview[]) => {
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        data: comments
                                                    }));
                                                }, [state, subComments, userIdFullNameMapping])}
                                                subComments={subComments}
                                                setSubComments={React.useCallback((subComments: any[]) => {
                                                    setSubComments(subComments);
                                                }, [state, subComments, userIdFullNameMapping])}
                                                userIdFullNameMapping={userIdFullNameMapping}
                                                setUserIdFullNameMapping={React.useCallback((mapping: any) => {
                                                    setUserIdFullNameMapping(mapping);
                                                }, [state, subComments, userIdFullNameMapping])}
                                                setLoading = {setLoading}
                                            />
                                        </Grid>
                                        <Grid container justifyContent="space-between" alignItems="center" item md={12} xs={12}>
                                            <Grid item>
                                                Showing {state.start + 1}-{Math.min(state.end, state.actualDataCount)} of {state.actualDataCount} records
                                            </Grid>
                                            <Grid item>
                                                <MuiPagination
                                                    color="primary"
                                                    count={state.totalPaginationBlockCount}
                                                    onChange={(event, newPage) => {
                                                        handleFetchProductReviews({
                                                            start: (newPage - 1) * state.pageSize,
                                                            end: newPage * state.pageSize
                                                        } as PaginatedGridInterface);
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                isEdit && !isView ?
                                    <>
                                        <Grid item md={12} xs={12}>
                                            <RenderInput
                                                inputType={InputType.RichTextArea}
                                                rteRef={rteRefReview}
                                                label="Product Review"
                                                isView={isView}
                                                value={review}
                                                name="insertEditor"
                                            />
                                        </Grid>

                                        <Grid item md={1} xs={12}>
                                            <BlueButton
                                                label="Submit Review"
                                                handleSubmit={() => handleAddProductReview()}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12}>
                                            <RenderInput
                                                isView={isView}
                                                inputType={InputType.Rating}
                                                value={rating}
                                                handleChange={React.useCallback((value: number) => {
                                                    setRating(value);
                                                }, [rating])}
                                                precision={0.1}
                                                label = ""
                                            />
                                        </Grid>
                                    </>
                                    :
                                    <></>
                            }
                        </SectionLayout>
                        <br/>
                    </>
                :
                <></>
            }

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="productId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.products}
                    buttonText="Product"
                />
            }
        </OutletLayout>
    )
}

export default AddEditProduct;