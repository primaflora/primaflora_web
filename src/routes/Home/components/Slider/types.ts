export type TSliderContextProps = {
    slidesCount: number;
    slideIndex: number;
    slides: { image: string; text: string }[];
    changeSlide: (direction: 1 | -1) => void;
    goToSlide: (index: number) => void;
};
