import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FutureCoursesComponent } from './future-courses.component';
describe('FutureCoursesComponent', () => {
  let component: FutureCoursesComponent;
  let fixture: ComponentFixture<FutureCoursesComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [FutureCoursesComponent]}).compileComponents();
    fixture = TestBed.createComponent(FutureCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});