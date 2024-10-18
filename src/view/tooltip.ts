


export class Tooltip extends HTMLDivElement {

    className: string = "tooltip-text";

    constructor( text: string ) {
        super();
        this.textContent = text;
    }

    setStyle() {
        this.style.visibility = "hidden";
        this.style.width = "150px";
        this.style.backgroundColor = "black";
        this.style.color = "white";
        this.style.textAlign = "center";
        this.style.borderRadius = "5px";
        this.style.padding = "5px";
        this.style.position = "absolute";
        this.style.zIndex = "1";
        this.style.bottom = "125%"; /* Position the tooltip above the div */
        this.style.left = "50%";
        this.style.marginLeft = "-75px";
        this.style.opacity = "0";
        this.style.transition = "opacity 0.3s";
        return this;
    }

    setInteractivity() {
        if (this.parentElement) {
            this.parentElement.addEventListener('mouseenter', () => {
                this.style.visibility = 'visible';
                this.style.opacity = "1";
            });
            this.parentElement.addEventListener('mouseleave', () => {
                this.style.visibility = 'hidden';
                this.style.opacity = "0";
            })
        }

        return this;
    }

}