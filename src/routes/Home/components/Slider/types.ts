export type TSliderContextProps = {
    slidesCount: number;
    slideIndex: number;
    slides: { imageUrl: string; title: string, textColor: string, link: string }[];
    changeSlide: (direction: 1 | -1) => void;
    goToSlide: (index: number) => void;
};
