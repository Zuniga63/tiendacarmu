let screenWidth = screen.width;
let rezizeInProcess = false;

window.addEventListener('load', () => {
    console.log('Landing start');
    sliderController();
    cardGalleryControler();
    updateSliderWidth(document.getElementById('featureProductsSlider'));
    
    window.addEventListener('resize', ()=> {
        screenWidth = screen.width;
        if(!rezizeInProcess){
            rezizeInProcess = true;
            setTimeout(() => {
                console.log(`rezize: ${screenWidth} | ${screen.width}` );
                if(screenWidth === screen.width){
                    updateSliderWidth(document.getElementById('featureProductsSlider'));
                }
                rezizeInProcess = false;
            }, 1000);
        }
    })
})


const updateSliderWidth = (slider) => {
    const sliderContainer = slider.querySelector('.slider__items');
    let btnNext = slider.querySelector('.slider__btn-next');
    let btnPrev = slider.querySelector('.slider__btn-prev');
    const items = sliderContainer.querySelectorAll('.slider__item');
    let id = slider.getAttribute('id');
    let width = 0;
    let step = 100;

    if(screen.width >= 1000){
        if (items && items.length > 2) {
            width = (items.length / 3) * 100;
            step = 100/3;
        } else {
            width = 100;
        }
    }else if (screen.width >= 768) {
        if (items && items.length > 2) {
            width = (items.length / 2) * 100;
            step = 50;
        } else {
            width = 100;
        }
    } else {
        width = items.length * 100;
    }

    sliderContainer.style.width = `${width}%`;
    sliderContainer.insertBefore(items[items.length - 1], items[0]);
    //Se mueve el margen un 100% a la izquierda
    sliderContainer.style.marginLeft = `-${step}%`;

    if (btnNext && btnPrev) {
        btnNext = btnNext.cloneNode(false);
        btnPrev = btnPrev.cloneNode(false);

        // btnNext.addEventListener('click', (e) => {
        //     sliderNext(id, 500, step);
        //     sliderAutoplayStop(searchSliderRoot(e.target));
        // })

        // btnPrev.addEventListener('click', (e) => {
        //     sliderPrev(id, 500, step);
        //     sliderAutoplayStop(searchSliderRoot(e.target));
        // })
    }//Fin de if
}