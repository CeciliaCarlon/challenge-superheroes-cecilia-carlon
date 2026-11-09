import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroSearchComponent } from './hero-search.component';

describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSearchComponent]
    })
    .compileComponents();
  });

  it('should create', () => {
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(HeroSearchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    expect(component).toBeTruthy();
  });

  it('should emit empty string initially due to startWith("")', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(HeroSearchComponent);
      component = fixture.componentInstance;

      let emittedValue: string | undefined;
      component.searchChange.subscribe(val => emittedValue = val);
      fixture.detectChanges();

      tick(200);

      expect(emittedValue).toBe('');
    });
  }));

  it('should emit the trimmed search term when length is 3 or more after debounce', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(HeroSearchComponent);
      component = fixture.componentInstance;

      let emittedValue = '';
      component.searchChange.subscribe(val => emittedValue = val);
      fixture.detectChanges();
      tick(200);

      component.searchControl.setValue('    bat    ');
      tick(199);
      expect(emittedValue).toBe('');

      tick(1);
      expect(emittedValue).toBe('bat');
    });
  }));

  it('should emit empty string if search term length is between 1 and 2 characters', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(HeroSearchComponent);
      component = fixture.componentInstance;

      let emittedValue = '';
      component.searchChange.subscribe(val => emittedValue = val);
      fixture.detectChanges();
      tick(200);

      component.searchControl.setValue('ba');
      tick(200);

      expect(emittedValue).toBe('');
    });
  }));

  it('should ignore consecutive duplicate values due to distinctUntilChanged', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(HeroSearchComponent);
      component = fixture.componentInstance;

      const emittedValues: string[] = [];
      component.searchChange.subscribe(val => emittedValues.push(val));
      fixture.detectChanges();
      tick(200);

      component.searchControl.setValue('bat');
      tick(200);

      component.searchControl.setValue('   bat    ');
      tick(200);

      expect(emittedValues).toEqual(['', 'bat', 'bat']);
    });
  }));
});
