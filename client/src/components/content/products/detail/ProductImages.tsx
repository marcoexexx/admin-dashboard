import { Box } from "@mui/material";
import { chunk, range } from "lodash";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";

const TOTAL_DISPLAY = 3;

interface ProductImagesProps {
  images: string[];
}

export function ProductImages(props: ProductImagesProps) {
  const { images } = props;

  const [selectedImg, setSelectedImg] = useState(
    images[0] || "/default.png",
  );

  const handleSelectImage = (src: string) => () => {
    setSelectedImg(src);
  };

  return (
    <>
      <Box
        py={2}
        display="flex"
        flexDirection="column"
      >
        <Box
          maxWidth={500}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            component="img"
            height={{ xs: 300, md: 400 }}
            px={2}
            src={selectedImg}
            alt="Primary image"
          />
        </Box>

        <Box>
          <Carousel height={100} autoPlay={false} animation="slide">
            {chunk(images, TOTAL_DISPLAY).map((src, idx) => {
              return (
                <Box
                  key={idx}
                  mt={2}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    // bgcolor="red"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={3}
                  >
                    {range(TOTAL_DISPLAY).map(key => {
                      if (src[key]) {
                        return (
                          <Box
                            sx={{
                              cursor: "pointer",
                            }}
                            onClick={handleSelectImage(src[key])}
                            component="img"
                            p={2}
                            border={(theme) =>
                              `solid 1px ${theme.colors.alpha.black[10]}`}
                            borderRadius={(theme) =>
                              `${theme.shape.borderRadius}px`}
                            key={key}
                            height={100}
                            src={src[key]}
                            alt="product img"
                          />
                        );
                      }
                    })}
                  </Box>
                </Box>
              );
            })}
          </Carousel>
        </Box>
      </Box>
    </>
  );
}
