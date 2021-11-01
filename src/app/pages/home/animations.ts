import {
    trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'max-height': '370px', 'opacity': '1', 'visibility': 'visible', 'overflow-y': 'scroll'
        })),
        state('out', style({
            'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('500ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('500ms ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('500ms ease-in-out', style({
                'max-height': '370px'
            })),
        ]
        )])
    ]),
]