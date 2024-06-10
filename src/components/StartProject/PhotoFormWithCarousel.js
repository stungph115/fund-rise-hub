import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../../styles/Carousel.css'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
const FileUploadForm = ({ photos, setPhotos, files, setFiles }) => {

    const handleDrop = acceptedFiles => {
        const newPhotos = [...photos, ...acceptedFiles];
        setPhotos(newPhotos);

        const newFiles = [...files, ...acceptedFiles.map(file => URL.createObjectURL(file))];
        setFiles(newFiles);
    };

    /*  useEffect(() => {
         console.log(files);
     }, [files]);
  */
    const removePhoto = index => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);

        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };


    return (
        <Container>
            <div style={{ width: 650 }}>
                <Dropzone onDrop={handleDrop}
                    accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [], 'image/bmp': [], 'image/tiff': [] }}
                    maxFiles={10}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className='start-project-dropzone'>
                            <input {...getInputProps()} />
                            <p>
                                {files.length > 0 && files.length < 10 &&
                                    files.length + ' photo(s) choisi(s), glissez ou cliquez pour ajouter encore'
                                }
                                {files.length >= 10 &&
                                    "10 photos choisis, vous ne pouvez plus ajouter"
                                }
                                {files.length === 0 &&
                                    'Glissez et déposez des photos ici, ou cliquez pour sélectionner des photos'
                                }
                            </p>
                        </div>
                    )}
                </Dropzone>
                <MultiCarousel
                    additionalTransfrom={0}
                    arrows
                    centerMode={false}
                    containerClass="carousel-container"
                    draggable
                    focusOnSelect={false}
                    /* infinite */
                    itemClass="carousel-item-padding-40-px"
                    keyBoardControl
                    minimumTouchDrag={80}
                    renderButtonGroupOutside={false}
                    renderDotsOutside
                    responsive={{
                        desktop: {
                            breakpoint: { max: 2000, min: 600 },
                            items: 2,
                            partialVisibilityGutter: 40
                        },
                        tablet: {
                            breakpoint: { max: 1024, min: 464 },
                            items: 2,
                            partialVisibilityGutter: 30
                        },
                        mobile: {
                            breakpoint: { max: 464, min: 0 },
                            items: 1,
                            partialVisibilityGutter: 30
                        }
                    }}
                    /*          showDots */
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                >
                    {files.map((file, index) => (
                        <div key={index} style={{ position: 'relative', padding: '10px' }}>
                            <div className="photo-number">{index + 1}</div>
                            <Image
                                className="crousel-image"
                                src={file}
                                alt={`Slide ${index}`}
                                style={{ objectFit: 'cover', height: '200px' }}
                            />

                            <div className='carousel_remove-button' onClick={() => removePhoto(index)}>
                                <FontAwesomeIcon icon={faXmarkCircle} size='lg' />
                            </div>
                        </div>
                    ))}
                </MultiCarousel>
            </div>
        </Container>
    );
};

export default FileUploadForm;
