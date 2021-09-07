import { Pen } from '../pen';
import { calcCenter } from '../rect';
import { globalStore } from '../store';
import { getRect, parseSvgPath, pathToString, scalePath, translatePath } from './svg/parse';

export function svgPath(pen: Pen) {
  const pathText = globalStore.paths[pen.pathId];
  if (!pathText) {
    return new Path2D();
  }

  const path = parseSvgPath(pathText);
  pen.calculative.svgRect = getRect(path);
  calcCenter(pen.calculative.svgRect);

  if (
    pen.calculative.svgRect.width !== pen.calculative.worldRect.width ||
    pen.calculative.svgRect.height !== pen.calculative.worldRect.height
  ) {
    scalePath(
      path,
      pen.calculative.worldRect.width / pen.calculative.svgRect.width,
      pen.calculative.worldRect.height / pen.calculative.svgRect.height
    );
    const rect = getRect(path);
    calcCenter(rect);
    translatePath(path, pen.calculative.worldRect.x - rect.x, pen.calculative.worldRect.y - rect.y);
  }

  const path2D = new Path2D(pathToString(path));
  path2D.closePath();

  return path2D;
}
