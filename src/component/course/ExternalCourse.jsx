import { Box, Button, Card, HStack, Image } from "@chakra-ui/react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from "react";
import "./ExternalCourse.css";
import ClampedText from "../common/ClampedText";

const ExternalCourse = ({ course }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card.Root
            className={`course-list-card ec__card${expanded ? " ec__card--expanded" : ""}`}
        >
            <div className="ec__badge">Udemy</div>

            <Image
                className="ec__image"
                src={course.image && course.image.trim() !== "" ? course.image : "https://placehold.co/150x246?text=Udemy"}
                alt={course.title}
            />

            <Box className="ec__content">
                <Card.Body>
                    <HStack mb="2" align="center">
                        <Card.Title className="ec__title">
                            {course.title}
                        </Card.Title>
                    </HStack>

                    <ClampedText
                        text={course.description}
                        className="description ec__description"
                        lines={3}
                    />
                    {/* <Card.Description
                        className={`description ec__description${expanded ? " ec__description--expanded" : ""}`}
                    >
                        {course.description}
                    </Card.Description>
                    {!expanded && (
                        <span className="ec__toggle" onClick={() => setExpanded(true)}>
                            Read more...
                        </span>
                    )}
                    {expanded && (
                        <span className="ec__toggle" onClick={() => setExpanded(false)}>
                            Show less
                        </span>
                    )} */}
                </Card.Body>

                <Card.Footer>
                    <HStack spacing={4}>
                        <a href={course.link} target="_blank" rel="noopener noreferrer">
                            <Button size="sm">
                                View on Udemy <OpenInNewIcon sx={{ fontSize: 14, ml: 1 }} />
                            </Button>
                        </a>
                    </HStack>
                </Card.Footer>
            </Box>
        </Card.Root>
    );
};

export default ExternalCourse;
