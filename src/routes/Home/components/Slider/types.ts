export type TSliderContextProps = {
    slidesCount: number;
    slideIndex: number;
    slides: { imageUrl: string; title: string }[];
    changeSlide: (direction: 1 | -1) => void;
    goToSlide: (index: number) => void;
};
