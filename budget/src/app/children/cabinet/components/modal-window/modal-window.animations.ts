import {animate, AnimationTriggerMetadata, keyframes, state, style, transition, trigger} from '@angular/animations';

export const modalTrigger: AnimationTriggerMetadata = trigger('modalTrigger', [
    state('hide', style({
        opacity: 0,
        marginTop: '30px'
    })),
    state('show', style({
        opacity: 1,
        marginTop: '100px'
    })),
    transition('hide => show', animate(300, keyframes([
        style({
            opacity: 0,
            marginTop: '30px'
        }),
        style({
            opacity: 0.4,
            marginTop: '60px'
        }),
        style({
            opacity: 0.7,
            marginTop: '80px'
        }),
        style({
            opacity: 0.9,
            marginTop: '90px'
        }),
        style({
            opacity: 1,
            marginTop: '100px'
        }),
    ])))
]);
