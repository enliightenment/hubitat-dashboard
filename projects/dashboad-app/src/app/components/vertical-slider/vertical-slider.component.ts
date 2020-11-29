import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-vertical-slider',
  templateUrl: './vertical-slider.component.html',
  styleUrls: ['./vertical-slider.component.scss']
})
export class VerticalSliderComponent implements OnInit {

  @ViewChild('slidertrack') slidertrack: ElementRef<HTMLDivElement>;
  @ViewChild('sliderhandle') sliderhandle: ElementRef<HTMLDivElement>;
  @Input() value: number = 0;
  private dragStartY: number;

  
  private debouncer: Subject<number> = new Subject<number>();
  @Output() changed: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(200)).subscribe(x=> this.changed.next(x));
  }

  handleDragging(e: DragEvent) {
    const trackRect = this.slidertrack.nativeElement.getBoundingClientRect();
    let y = e.clientY;
    if(y < trackRect.top){
      y = trackRect.top;
    }else if (y > trackRect.bottom){
      y = trackRect.bottom;
    }
    const fromTop = y - trackRect.top;
    const percent = (trackRect.height - fromTop) / trackRect.height;
    this.value = 100 * percent;

    this.debouncer.next(this.value);
  }

  handleDragEnd(e: DragEvent){
    const trackRect = this.slidertrack.nativeElement.getBoundingClientRect();
    let y = e.clientY;
    if(y < trackRect.top){
      y = trackRect.top;
    }else if (y > trackRect.bottom){
      y = trackRect.bottom;
    }
    const fromTop = y - trackRect.top;
    const percent = (trackRect.height - fromTop) / trackRect.height;
    this.value = 100 * percent;
    this.debouncer.next(this.value);
  }

  handleDragStart(e: DragEvent) {
    this.dragStartY = e.clientY;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }

}
