import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTagsComponent } from './display-tags.component';

describe('DisplayTagsComponent', () => {
  let component: DisplayTagsComponent;
  let fixture: ComponentFixture<DisplayTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayTagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
