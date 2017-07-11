import {buildDOM} from 'pomace-base';
import Tap from 'pomace-tap';
import Cabinet from 'pomace-cabinet';

export default (group) => {
  const progress = buildDOM('<div class="pomace-progress">');
  const container = Cabinet({rows: 1, cols: group.length});
  const animaTime = 500;
  const element = {
    squares: [],
    squareMasks: [],
    squareMaskDely: [],
    squareBottoms: [],
    lines: [],
    lineMasks: [],
    lineMaskDely: [],
    taps: [],
    marks: [],
  };

  const animation = (animaTime,delay) => ({
   transition: `margin-left ${animaTime}ms linear ${delay}ms`,
   webkitTransition: `margin-left ${animaTime}ms linear ${delay}ms`,
   mozTransition: `margin-left ${animaTime}ms linear ${delay}ms`,
   oTransition: `margin-left ${animaTime}ms linear ${delay}ms`,
  });

  const build = () => {
    group.map((data,k) => {
      const item = Tap(data);
      const mark = buildDOM('<div class="progress-mark">');
      const square = buildDOM('<div class="progress-square">');
      const squareBottom = buildDOM('<div class="progress-square-bottom">');
      const squareMask = buildDOM('<div class="progress-square-mask">');
      const line = buildDOM('<div class="progress-line">');
      const lineMask = buildDOM('<div class="progress-line-mask">');

      element.lines.push(line);
      element.lineMasks.push(lineMask);
      element.squares.push(square);
      element.squareMasks.push(squareMask);
      element.squareBottoms.push(squareBottom);
      element.taps.push(item);
      element.marks.push(mark);

      square.$$.last(squareBottom);
      square.$$.last(squareMask);
      line.$$.last(lineMask);
      mark.$$.last(square);
      mark.$$.last(line);

      container.$$.col(0,k).$$.css({position: 'relative', overflow: 'hidden'});
      container.$$.col(0,k).$$.last(mark);
      container.$$.col(0,k).$$.last(item);

      mark.$$.css({overflow: 'hidden', position: 'relative'});
      lineMask.$$.css({marginLeft: '0%'});
      squareMask.$$.css({marginLeft: '0%'});

      if(k === 0){
        line.$$.css({
          position: 'relative',
          left: '50%',
        });
      }
    });
  };

  const reset = () => {
   const {lines, lineMasks, lineMaskDely, squares, squareMasks, squareMaskDely} = element;

   lineMasks.map((lineMask, k) => {
     const delay = animaTime * k;

     lineMaskDely[k] = delay;
     lineMask.$$.css(animation(animaTime,delay));
   });

   squareMasks.map((squareMask, k) => {
     const delay = animaTime * k;

     switch(k){
       case 0:
         squareMaskDely[k] = 0;
         squareMask.$$.css(animaTime/3,0);
       break;
       case (squareMasks.length - 1):
         squareMaskDely[k] = delay+animaTime*(3/4);
         squareMask.$$.css(animation(animaTime/3,delay+animaTime*(3/4)));
       break;
       default:
         squareMaskDely[k] = delay+animaTime/3;
         squareMask.$$.css(animation(animaTime/3,delay+animaTime/3));
     }
   });
  };

  build();
  progress.$$.css({display:'none'});
  progress.$$.last(container);
  progress.$$.extends({

    play(){
      const {lines, lineMasks, squares, squareMasks, squareBottoms} = element;
      const autoSquare = () => {

        lines.map((line, i) => {
          if(i === 0 || i === lines.length - 1){
            line.$$.css({
              width: '50%',
            });
          }
          line.$$.css({
            marginTop: '1.25rem',
            marginBottom: '1.25rem',
           	height: '0.15rem',
          });
          lineMasks[i].$$.css({
            height: '0.15rem',
          });
        });

        squares.map((sqr, i) => {
          sqr.$$.css({
            overflow: 'hidden',
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 1,
            marginTop: `${-lines[i].offsetWidth/(i === 0 || i === lines.length - 1? 3:6)}px`,
            marginLeft: `${-lines[i].offsetWidth/(i === 0 || i === lines.length - 1? 3:6)}px`,
            width: `${parseInt(lines[i].offsetWidth/3*(i === 0 || i === lines.length - 1? 2:1))}px`,
            height: `${parseInt(lines[i].offsetWidth/3*(i === 0 || i === lines.length - 1? 2:1))}px`,
          });
          squareBottoms[i].$$.css({
            width: `${parseInt(lines[i].offsetWidth/3*(i === 0 || i === lines.length - 1? 2:1))}px`,
            height: `${parseInt(lines[i].offsetWidth/3*(i === 0 || i === lines.length - 1? 2:1))}px`,
          });
          squareMasks[i].$$.css({
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          });
        });
      };

      reset();

      container.$$.autoWidth();

      window.addEventListener('resize',()=>{
        autoSquare();
      },false);

      progress.$$.css({display:'block'});
      autoSquare();
    },

    get(name){
      return element[name];
    },

    isUp: 0,

    up(code){
      reset();

      const {lines, lineMasks, lineMaskDely, squares, squareMasks, squareMaskDely, taps} = element;

      if(code - this.isUp === 1){
        //progress 1 step
        const lineM = lineMasks[code-1];
        const squareM = squareMasks[code-1];
        const square = squares[code-1];
        const tap = taps[code-1];

        setTimeout(() => {
          lineM.$$.css(animation(animaTime,code-1 === 0? animaTime/3:0));
          lineM.$$.css({
            marginLeft: '100%',
          });
        },0);

        setTimeout(() => {
          squareM.$$.css(animation(animaTime/3,code-1 === 0? 0:animaTime/3));
          squareM.$$.css({
            marginLeft: '100%',
          });
        },0);

        tap.$$.addClass('progress-up');
        this.isUp++;

      }else if(code - this.isUp === -1){
        //back 1 step
        const lineM = lineMasks[code];
        const squareM = squareMasks[code];
        const square = squares[code];
        const tap = taps[code];

        setTimeout(() => {
          lineM.$$.css(animation(animaTime,0));
          lineM.$$.css({
            marginLeft: '0%',
          });
        },0);

        setTimeout(() => {
          squareM.$$.css(animation(animaTime/3,animaTime/3));
          squareM.$$.css({
            marginLeft: '0%',
          });
        },0);

        tap.$$.removeClass('progress-up');

        if(this.isUp > 0){
          this.isUp--;
        }
      }else{
        //back multi step
        for(let i=lineMaskDely.length-1;i>=0;i--){
         const lm = lineMasks[lineMasks.length-i-1];
         const sm = squareMasks[squareMasks.length-i-1];

         if(lineMasks[i] && lines[i]){
           setTimeout(() => {
             lm.$$.css(animation(animaTime,lineMaskDely[i]));
             sm.$$.css(animation(animaTime/3,squareMaskDely[i]));
             lm.$$.css({marginLeft: '0%',});
             sm.$$.css({marginLeft: '0%',});
             taps[i].$$.removeClass('progress-up');
           },0);

           if(this.isUp > 0){
             this.isUp--;
           }
         }
        }

        //progress multi step
        for(let i=0;i<lineMaskDely.length;i++){
         if(i >= code){
           break;
         }

         const lm = lineMasks[i];
         const sm = squareMasks[i];

         if(lineMasks[i] && lines[i]){
           setTimeout(() => {
            lm.$$.css(animation(animaTime,lineMaskDely[i]));
            sm.$$.css(animation(animaTime/3,squareMaskDely[i]));
            lm.$$.css({marginLeft: '100%',});
            sm.$$.css({marginLeft: '100%',});
             taps[i].$$.addClass('progress-up');
           },0);

           this.isUp++;
         }
        }
      }
    },
  });

  return progress;
};
