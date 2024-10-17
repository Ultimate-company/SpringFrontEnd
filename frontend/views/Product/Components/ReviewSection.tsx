import {ProductReview, ProductReviewResponseModel} from "Frontend/api/Models/CarrierModels/Product";
import {
    Avatar,
    Button,
    IconButton,
    Typography,
    Stack,
    Card,
    Box, Grid, Rating,
} from "@mui/material";
import React from "react";
import parse from "html-react-parser";
import {formatDate, getRandomColor} from "Frontend/components/commonHelperFunctions";
import { Delete, Edit, Add, Remove, Forward, Cancel} from "@mui/icons-material";
import {productApi, userApi} from "Frontend/api/ApiCalls";
import {User} from "Frontend/api/Models/CentralModels/User";
import {useConfirm} from "material-ui-confirm";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import {RichTextEditorRef} from "mui-tiptap";
import StarIcon from "@mui/icons-material/Star";

interface ReviewSectionProps {
    comments: ProductReview[];
    setComment: (comments: ProductReview[]) => void;
    subComments: { [key: number]: number[] };
    setSubComments: any;
    userIdFullNameMapping: { [key: number]: string };
    setUserIdFullNameMapping: any;
    setLoading: any;
}

const ReviewSection: React.FC<ReviewSectionProps> = (props) => {
    // Hooks used in component
    const confirm = useConfirm();
    const [loggedInUser, setLoggedInUser] = React.useState<User | null>(null);
    const [editingCommentId, setEditingCommentId] = React.useState<number | null>(null);
    const [replyToCommentId, setReplyToCommentId] = React.useState<number | null>(null);
    const [editValue, setEditValue] = React.useState<string>('');
    const [editRating, setEditRating] = React.useState<number>(0.0);
    const rteRef = React.useRef<RichTextEditorRef>(null);

    // local helper function
    const getInitialsForAvatar = (name: string) => {
        let nameSplit = name.split(" ");
        return nameSplit[0].substring(0, 1).toUpperCase() + nameSplit[1].substring(0, 1).toUpperCase()
    }
    const isUserCommentOwner = (userId: number) => {
        return loggedInUser?.userId === userId;
    };

    // Fetch logged-in user information
    React.useEffect(() => {
        userApi(props.setLoading).getLoggedInUser()
            .then((response: User) => {
                setLoggedInUser(response);
            });
    }, []);

    // on click handlers
    const handleReplyClick = (comment: ProductReview, isCancel: boolean) => {
        if (isCancel) {
            setReplyToCommentId(null); // Clear reply state when canceling
        } else {
            const scrollPosition = window.scrollY;
            setReplyToCommentId(comment.reviewId); // Set reply state

            // Restore the scroll position after rendering
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'auto'
                });
            });
        }
    };
    const handleEditClick = (comment: ProductReview, isCancel: boolean) => {
        if(isCancel) {
            setEditValue('');
            setEditingCommentId(null);
            setEditRating(0.0);
        }
        else {
            const scrollPosition = window.scrollY;
            setEditValue(comment.review);
            setEditingCommentId(comment.reviewId);

            // Restore the scroll position after rendering
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'auto'
                });
            });
        }
    };

    // submit handlers
    const handleEditSubmit = (comment: ProductReview) => {
        productApi(props.setLoading).insertProductReview({
            review: rteRef.current?.editor?.getHTML() ?? "",
            ratings: editRating,
            reviewId: comment.reviewId,
            productId: comment.productId
        } as ProductReview)
            .then((response: number) => {
            // Update the score of the specific comment
            const updatedComment = { ...comment,
                review: rteRef.current?.editor?.getHTML() ?? "",
                rating: editRating
            };

            // Update the comments array
            const updatedComments = props.comments.map(c =>
                c.reviewId === comment.reviewId ? updatedComment : c
            );

            // Set the updated comments array to state
            props.setComment(updatedComments);

            // close the editor
            handleEditClick(comment, true);
        })
    }
    const handleReplySubmit = (comment: ProductReview) => {
        productApi(props.setLoading).insertProductReview({
            review: rteRef.current?.editor?.getHTML() ?? "",
            ratings: editRating,
            parentId: comment.reviewId,
            productId: comment.productId
        } as ProductReview)
            .then((reviewId: number) => {
                productApi(props.setLoading).getProductReviewById(reviewId)
                    .then((response: ProductReviewResponseModel) =>{
                        const { productReview, user } = response;
                        const { reviewId: newReviewId } = productReview;
                        const { userId, firstName, lastName } = user;

                        // Step 1: Update the comments state
                        const updatedComments = [...props.comments, productReview];
                        props.setComment(updatedComments);

                        // Step 2: Update the subComments state
                        const updatedSubComments = {
                            ...props.subComments,
                            [comment.reviewId]: [...(props.subComments[comment.reviewId] || []), newReviewId]
                        };
                        props.setSubComments(updatedSubComments);

                        // Step 3: Update the userIdFullNameMapping state
                        const fullName = `${firstName} ${lastName}`;
                        const updatedUserIdFullNameMapping = {
                            ...props.userIdFullNameMapping,
                            [userId as number]: fullName
                        };
                        props.setUserIdFullNameMapping(updatedUserIdFullNameMapping);

                        // close the editor
                        handleReplyClick(comment, true);
                    });
            });
    };

    const handleRatingChange = React.useCallback((value: number) => {
        setEditRating(value);
    }, []);
    const handleOnCreated = () => {
        const parentDiv = document.querySelector('#productReviewEditor');
        if(parentDiv){
            const proseMirrorDiv = parentDiv.querySelectorAll('.ProseMirror');
            if(proseMirrorDiv && proseMirrorDiv[0] != null) {
                proseMirrorDiv[0].innerHTML = editValue ?? "";
            }
        }
    }


    const renderComments = (commentId: number, depth: number) => {
        const comment = props.comments.find((c) => c.reviewId === commentId);
        if (!comment) return null;

        return (
            <Stack
                key={comment.reviewId}
                spacing={2}
                ml={depth * 5} // Adjust this value for the desired left margin
                direction="column"
                sx={{ position: "relative" }}
            >
                <Card>
                    <Box sx={{ p: "15px" }}>
                        <Stack spacing={2} direction="row">
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexDirection: "column",
                                        backgroundColor: "hsl(228, 33%, 97%)",
                                        borderRadius: "5px",
                                        "& svg": {
                                            color: "hsl(239, 57%, 85%)",
                                            "&:hover": {
                                                color: "hsl(238, 40%, 52%)",
                                            },
                                        },
                                    }}
                                >
                                    <IconButton
                                        disableRipple
                                        aria-label="increase score"
                                        onClick={() => {
                                            productApi(props.setLoading).toggleProductReviewScore(comment.reviewId, true)
                                                .then((response: boolean) => {
                                                    if(response) {
                                                        // Update the score of the specific comment
                                                        const updatedComment = { ...comment, score: comment.score + 1 };

                                                        // Update the comments array
                                                        const updatedComments = props.comments.map(c =>
                                                            c.reviewId === comment.reviewId ? updatedComment : c
                                                        );

                                                        // Set the updated comments array to state
                                                        props.setComment(updatedComments);
                                                   }
                                                });
                                        }}
                                    >
                                        <Add sx={{ height: "20px", width: "20px" }} />
                                    </IconButton>
                                    <Typography sx={{ color: "custom.moderateBlue", fontWeight: 500 }}>
                                        {comment.score}
                                    </Typography>
                                    <IconButton
                                        disableRipple
                                        aria-label="decrease score"
                                        onClick={() => {
                                            productApi(props.setLoading).toggleProductReviewScore(comment.reviewId, false)
                                                .then((response: boolean) => {
                                                    if(response) {
                                                        // Update the score of the specific comment
                                                        const updatedComment = { ...comment, score: comment.score - 1 };

                                                        // Update the comments array
                                                        const updatedComments = props.comments.map(c =>
                                                            c.reviewId === comment.reviewId ? updatedComment : c
                                                        );

                                                        // Set the updated comments array to state
                                                        props.setComment(updatedComments);
                                                    }
                                                });
                                        }}
                                    >
                                        <Remove sx={{ height: "20px", width: "20px" }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ width: "100%" }}>
                                <Stack
                                    spacing={2}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Stack spacing={2} direction="row" alignItems="center">
                                        <Avatar style={{ backgroundColor: getRandomColor(comment.reviewId) }}>
                                            {getInitialsForAvatar(props.userIdFullNameMapping[comment.userId])}
                                        </Avatar>
                                        <Typography fontWeight="bold" sx={{ color: 'neutral.darkBlue' }}>
                                            {props.userIdFullNameMapping[comment.userId]}
                                        </Typography>
                                        <Typography sx={{ color: 'neutral.grayishBlue' }}>
                                            {formatDate(comment.createdAt, "mm dd yy, HH:mm")}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1}>
                                        {
                                            isUserCommentOwner(comment.userId) ?
                                                <Button
                                                    startIcon={<Delete />}
                                                    sx={{
                                                        color: 'custom.softRed',
                                                        fontWeight: 500,
                                                        textTransform: 'capitalize',
                                                    }}
                                                    onClick={() => {
                                                        confirm({
                                                            description: "Are you sure you want to delete this comment, this action cannot be undone?",
                                                            confirmationText: "Yes I'm Sure",
                                                            allowClose: true,
                                                            confirmationButtonProps: { autoFocus: true }
                                                        })
                                                            .then(() => {
                                                                productApi(props.setLoading).toggleProductReview(comment.reviewId)
                                                                    .then((response: boolean) => {
                                                                        if(response) {
                                                                            // Create a new array excluding the deleted comment
                                                                            const updatedComments = props.comments.filter(c => c.reviewId !== comment.reviewId);

                                                                            // Set the updated comments array to state
                                                                            props.setComment(updatedComments);
                                                                        }
                                                                    })
                                                            })
                                                            .catch(() => {});
                                                    }}
                                                >
                                                    Delete
                                                </Button>: <></>
                                        }
                                        {
                                            isUserCommentOwner(comment.userId) ?
                                                <Button
                                                    startIcon={editingCommentId !== comment.reviewId ? <Edit /> : <Cancel/>}
                                                    disabled={false} // Replace with appropriate condition
                                                    sx={{
                                                        color: "custom.moderateBlue",
                                                        fontWeight: 500,
                                                        textTransform: "capitalize",
                                                    }}
                                                    onClick={() => handleEditClick(comment, editingCommentId === comment.reviewId)}
                                                >
                                                    {editingCommentId !== comment.reviewId ? "Edit" : "Cancel"}
                                                </Button> : <></>
                                        }
                                        <Button
                                            startIcon={replyToCommentId !== comment.reviewId ? <Forward /> : <Cancel/>}
                                            sx={{
                                                color: 'custom.moderateBlue',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                            }}
                                            onClick={() => handleReplyClick(comment, replyToCommentId === comment.reviewId)}
                                        >
                                            {replyToCommentId !== comment.reviewId ? "Reply" : "Cancel"}
                                        </Button>
                                    </Stack>
                                </Stack>
                                {editingCommentId === comment.reviewId ? (
                                    <>
                                        <br/>
                                        <RenderInput
                                            inputType={InputType.RichTextArea}
                                            rteRef={rteRef}
                                            label="Product Review"
                                            isView={false}
                                            value={editValue}
                                            onCreated={() => {
                                                handleOnCreated();
                                            }}
                                            name = "productReviewEditor"
                                        />
                                        <br/>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Grid item md={1} xs={12}>
                                                <BlueButton
                                                    label="Edit Review"
                                                    handleSubmit={() => handleEditSubmit(comment)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <RenderInput
                                                    isView={false}
                                                    inputType={InputType.Rating}
                                                    value={editRating}
                                                    handleChange={handleRatingChange}
                                                    precision={0.1}
                                                    label=""
                                                />
                                            </Grid>
                                        </Stack>

                                    </>
                                ) : (
                                    <>
                                        <Rating
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                            value={comment.ratings}
                                            size="large"
                                            precision={0.1}
                                            readOnly />
                                        {comment.ratings}
                                        <Typography sx={{ color: 'neutral.grayishBlue', py: 2 }}>
                                            {parse(comment.review)}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </Card>

                {/* Render replies recursively */}
                {props.subComments[comment.reviewId]?.map((replyId) => (
                    <div key={replyId}>
                        {renderComments(replyId, depth + 1)}
                    </div>
                ))}

                {replyToCommentId === commentId && (
                    <Stack
                        spacing={2}
                        style={{marginLeft:(depth+1)*50}}
                        direction="column"
                        sx={{ position: "relative" }}
                    >
                        <Card>
                            <Box sx={{ p: "15px" }}>
                                <Stack spacing={2} direction="row">
                                    <Box sx={{ width: "100%" }}>
                                        <Stack
                                            spacing={2}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Stack spacing={2} direction="row" alignItems="center">
                                                <Avatar style={{ backgroundColor: getRandomColor(comment.reviewId) }}>
                                                    {getInitialsForAvatar(loggedInUser?.firstName + " " + loggedInUser?.lastName)}
                                                </Avatar>
                                                <Typography fontWeight="bold" sx={{ color: 'neutral.darkBlue' }}>
                                                    {loggedInUser?.firstName + " " + loggedInUser?.lastName}
                                                </Typography>
                                                <Typography sx={{ color: 'neutral.grayishBlue' }}>
                                                    {formatDate(new Date().toString(), "mm dd yy, HH:mm")}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <>
                                            <br/>
                                            <RenderInput
                                                inputType={InputType.RichTextArea}
                                                rteRef={rteRef}
                                                label="Edit Product Review"
                                                isView={false}
                                                value={editValue}
                                                onCreated={() => {
                                                    handleOnCreated();
                                                }}
                                                name = "productReviewReplyEditor"
                                            />
                                            <br/>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Grid item md={1} xs={12}>
                                                    <BlueButton
                                                        label="Reply to review"
                                                        handleSubmit={() => handleReplySubmit(comment)}
                                                    />
                                                </Grid>
                                                <Grid item md={3} xs={12}>
                                                    <RenderInput
                                                        isView={false}
                                                        inputType={InputType.Rating}
                                                        value={editRating}
                                                        handleChange={handleRatingChange}
                                                        precision={0.1}
                                                        label=""
                                                    />
                                                </Grid>
                                            </Stack>

                                        </>
                                    </Box>
                                </Stack>
                            </Box>
                        </Card>
                    </Stack>
                )}
            </Stack>
        );
    };

    return (
        <Stack
            id="reviewSection"
            style={{ height: 800, overflow: "scroll" }}
            spacing={2}
        >
            {/* Filter top-level comments and start rendering */}
            {props.comments
                .filter((review) => review.parentId === null)
                .sort((a, b) => b.reviewId - a.reviewId) // Sort by reviewId in descending order
                .map((comment) => (
                    <Stack key={comment.reviewId} spacing={2}>
                        {renderComments(comment.reviewId, 0)}
                    </Stack>
                ))}
        </Stack>
    );
};

export default React.memo(ReviewSection);