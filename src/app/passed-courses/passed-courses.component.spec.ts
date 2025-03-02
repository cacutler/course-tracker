import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassedCoursesComponent } from './passed-courses.component';
describe('PassedCoursesComponent', () => {
  let component: PassedCoursesComponent;
  let fixture: ComponentFixture<PassedCoursesComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [PassedCoursesComponent]}).compileComponents();
    fixture = TestBed.createComponent(PassedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});