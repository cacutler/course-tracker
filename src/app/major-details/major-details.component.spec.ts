import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MajorDetailsComponent } from './major-details.component';
describe('MajorDetailsComponent', () => {
  let component: MajorDetailsComponent;
  let fixture: ComponentFixture<MajorDetailsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [MajorDetailsComponent]}).compileComponents();
    fixture = TestBed.createComponent(MajorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});