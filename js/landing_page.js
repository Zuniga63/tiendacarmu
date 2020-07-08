// let screenWidth = screen.width;
let screenWidth = document.documentElement.clientWidth;
let rezizeInProcess = false;

window.addEventListener('load', () => {
    console.log('Landing start');
    sliderController();
    cardGalleryControler();
    // updateSliderWidth(document.getElementById('featureProductsSlider'));

    /**
     * Esto corrige una peculiaridad en el slider de productos destacados
     * cuando la pantalla es redimensionada
     */
    window.addEventListener('resize', ()=> {
        screenWidth = document.documentElement.clientWidth;
        if(!rezizeInProcess){
            rezizeInProcess = true;
            setTimeout(() => {
                console.log(`rezize: ${screenWidth} | ${document.documentElement.clientWidth}` );
                sliderPrev('featureProductsSlider', 500);
                rezizeInProcess = false;
            }, 500);
        }
    })
})