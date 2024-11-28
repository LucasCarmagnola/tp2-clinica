import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [ // Animación para cuando el componente aparece
        style({ opacity: 0 }), // Estado inicial
        animate('1s ease-in', style({ opacity: 1 })) // Estado final
      ]),
    ])
  ]
})
export class MisHorariosComponent {

  logoBase64 : string = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N13lBzHnSf4b2RmZdl2QMMRhiCJRjfQhCNAJ4lDUd5S0lBjJJGSRqM97bwxq9m9N/tuze3c7r2dufdGuyfdaEcaeTeyI4mizFCGlERRJIFu+IYnCO/aok2ZdHF/NJoEG22qKyMrTX0/f/CBje7IX6GiK34ZGfELgIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIgCJMIOIE6klNrOnftvDjuOuNB1e8w0TTfsOIioMWzatGlECCHDjiMumAAA6OnpWSGE8SYNYosE1nuue7Mn0S6lzEEiDUjD8yT/rRYgkzWRzaXDDoOIGtMIgH4hxKDneYNCiDMATgkhTgN4wXGcQ93d3eMhxxi6hhvU9u7du9J1xQfgeW+QEh2u5y3xXC8VdlxJIYRAvpBByjTCDoWIaDYSwEkp5X5N0/Z5nveMYRjPdnR0jIYdWD0lPgHo6elp10Xqzzzpvcux3fWeJzNhx5RUuq4h35SFrmthh0JEtFAugD4hxK8A/GRsbOxXO3bsKIYdVJASmQDs3t23Ubr2f3Y99/WeKxdLyUdCQTNNA7lCBkIksksRUeMpA/gVgO/ruv7PHR0d/WEHpFpiPq337t270nPEf3dd722u6y7ioF8/2VwamawZdhhEREFxhRBPSCm/CeBbXV1dY2EHpELsE4DenXsflkL+B9dxu7hQr/5yhQzSaS6hIKKGUQbwmKZp/7h+/fqfhx2MH7EcMHt6enIa9L9zHO8Druvlwo6nEQkhUGjOwjD0sEMhIgpLr5TyY5cuXfr2Aw884IQdzELFKgHY9/S+pY4pP2s7zlukJznyhISL/YiIXuaMEOLjY2Njn4rTwsFYJAA9PT0tgP6Pru2+2/MkR50QGYaOfFMWmhaLrkNEVE/9AD6Wz+c/sXr16lLYwcwn0p/iUkqjd9fezzqO+7CUvOMPW8o0UGjKhh0GEVHUnQPwf3Z2dn5JCOGFHcxsIpsA7N194EMVy/q453qFsGOhyW1+eQ7+REQLsVsI8dHOzs6nwg5kJpFLAHbv7tvo2ZUf2Y67NuxYaFI6k0Iuz/pJREQ1kAC+puv6v41aLYFIPU/v7d37P+xK6QAH/+jIZE0O/kREtRMAHnZd9+jhw4f/t7CDuV4kZgB6e3s3e674uWO7S8KOhV6Sy2eQznCPPxGRQj92XfePu7u7L4UdSOgzAL29+/6DXZF7OPhHSzaf5uBPRKTeW3Rd33/kyJEHww4ktBmAZ5893qxrY791bLc7rBhoZqzuR0QUOCmE+KTjOP+uu7vbCiOAUBKA/fv3by8V7V9yhX/05PJppDOs609EVCe9nuc9tHHjxtP1vnDdHwH07trz0dKEtZODf/Rw8Cciqrvtuq4/d/jw4fvrfeG6zgDs7tn72UrF/uN6XpOqw2l/IqJQOVLKP92wYcM/1uuCdUkApJTa7p69T1iWU/cMh+bH43yJiCLjE52dnR8VQgR+pn3gCUBfX59ZKlYO2ZZ7W9DXooXLZE1kc+mwwyAiopd8rrOz8yNCCDfIiwSaAPT09OSkqx11HHdVkNeh2qQzJnJ5Dv5ERBH0rfHx8Yd37NhhB3WBwBKAPXv2tDqWPOI47rKgrkG1M9Mp5Aus8EdEFGGP6br+ex0dHZUgGg9kF0BPT0/OscHBP6JSpsHBn4go+t7uuu63enp6AlmhrTwB6OvrM6WnHXZsh4N/BOm6hnyBp/oREcXEg4VC4etSSl11w0oTACmlVpqwDjq2u0Zlu6SGpgk0NecgInECBBERVemhI0eO/IPqRpUmALt79j5h206HyjZJDSEECs05CI2jPxFR3Agh/tWRI0f+k8o2lSUAu3v2foL7/KMr35SBrod+9hMREdXuvx49evQRVY0puR3cv+fgn04US3+voi1Sj1X+iIgSowLgtV1dXU/7bch3AtDb27vZseRuz1O/QIH8S2dSyOW54p+IKEEuCSF2dHZ2nvfTiK854Z6enpzr4Ncc/KPJSOkc/ImIkme5lPLbfX19vmq4+0oApKc/7Tpei582KBiaJlBoyoUdBhERBeNeTdP+xk8DNScAe3r2/R+O7Wz1c3EKxosr/rngn4gosYQQf3n06NG31PzztfzQvn1HOksT44eklFxWHkGFpixSphF2GEREFDAhxGXLsrZs2rTp8kJ/tqYB3CpPPMnBP5oyWZODPxFRg5BSLjNN83/V8rMLHsR7d+35n47jrajlYhQs3dB4tC8RUYORUv7u4cOHH1rozy3oEcCBAwdWF8crL3DVf/QIIdDcmofGSn9ERI3okmVZGzdv3jxc7Q8saAagUnJ+zsE/mvKFDAd/IqLGtTydTv/tQn6g6gRgz57977VtZ/3CY6Kg8bk/ERFJKT985MiRHdV+f1UJgJRSsy1b+UlE5J9u6HzuT0REwOSY/nEpZVXTwVUlALt37/u463jNvsIi5YSY3PJHRER0zSuOHj36e9V847xZQk9PT85zxIjrejxNJmJy+QzSGb4tRET0EiHEiQsXLmx44IEHnLm+b94ZAF0Yn+bgHz2maXDwJyKiG0gp161YseL9833fnDMAfX19hfHR8rDneVxhFiGaJtDUwi1/REQ0q9Ou667v7u62ZvuGOWcAymX7Uxz8oyeX55Y/IiKa082GYcw5CzDrKCKl1HY9t7vkup6v4wbj7tzZCzhy5DguXbqCocFh2LYDy7IByFDiaW1rxdJlS0K5NhFRJEmJbC6DTCaDxYtbsWTpYqxctRytrQ2/dv1oZ2fnRiGEN9Nfznp3v6d37//diIO/53p49tle9PTsxeDAIBxnzjUUdSWEAISOq1fHww6FiCjyFre34bZ1N2Pr1o249bY1k5+hjaXzyJEjbwXw2Ex/Oeu/xq7ndg87jtsaWFgRc/XqKL7/vR/j+RMvwHXdsMOZUSabQyrVcDkZEZFvra3NuOfebbj3FduRyTZU7ZRfdnV1PTDTX8yYAOzZs/8t5WLlR8HGFA3FiRK+8Y3v4eTJU5DejLMkkWAYBrK5QthhEBHFWiabxqvuuxOvfuAepFKNsZNK1/Xujo6OQ9O/PmMC0LNzz27bdrYFH1a4nnziN3jyiacie8f/EoFCoQlC4wnMREQqLFrUigff+Xps2Lgu7FACJ4T4WGdn5/9+w9enf6Gnp6fFsTBcbSnBOLIsC5//zNdw9tz5sEOpSjqThWk21JQVEVFd3HXPVrzjnW+AYST6nLtBXddXdnR0VK7/4g23lELqf53kwf/SpSv4f/7m47EZ/HVd5+BPRBSQnc/uxac++RWMjxfDDiVIix3Heev0L96QAEiJ369PPPV3+vQ5fOqTX0C5XJn/myMik2GtfyKiIJ09exGf/MSXMDAwHHYogRFC/MENX7v+f3p6elbYFXmhfiHVz+nT5/DZz3wFXuSf97/ETKeRTjMBICKqh5aWJvzJnz2CtraWsEMJQtF13WXd3d0v7iN/2QyAEMZ/rH9MwRsYGMIXPve1WA3+mhAwzUzYYRARNYyrV8fwmU99PamPA3KGYbzsMcDLEgDP9R6sbzzB81wPn/n0l2DbdtihLIiZzjRi0QoiolANDg7ja1/5HrwIbwuvlZTy7df//4sJQF9fn+k63qr6hxSsL3zh6xgfnwg7jAXRdB0pLvwjIgrFyefP4Imf/zbsMILwRinli+P+i3+oVOwPJW31/949B3Hy5Athh7FgmTSn/omIwvSLnz+N8+cvhx2Gau3Hjh3bMfU/LyYAnuO9N5x4guG5Hh577F/COrOnZoaRgm40RnUqIqKo8jwP3/32TyBlzAaReUgp3zj1Z+2lL2JTOOEE4wc/eBzlUjnsMBZGTBb9ISKi8J07dxG7ew+GHYZSUsrfmfqzBgA9PT25JB3843ke9uzZH3YYC5ZKpaGx3C8RUWT88olnEjULIIS458knnzSAawmAEHqiiv/89Ke/ghOzVf9CCKT57J+IKFKuXBlE38FjYYehUmHZsmWbgakEQGo3lAiMs72794UdwoJx2x8RUTTt2hm/MWUuuq7fC1xLAFzP3RxuOOpcungZY2Pj839jhAghkEqZYYdBREQzOHb0BYyNxWs7+TxemgGAxMpQQ1HoN7/ZGXYIC2aavPsnIooqz/NwqO942GGoNJkA9PX1mY7j5sOORpXTp86GHcKCTJb85d0/EVGUPX/idNghKCOlvF1KKTS34t4bdjAqjYyMhB3CgpjpDMC7fyKiSDv5fHISAACFw4cPr9FcIe8MOxJVBvoHYlW/WWgaUrz7JyKKvLGxCRSLpbDDUEYIsVaTbnIKAJ18IV7T/+l0GtNOZCYioojqvzIUdggqrdU86d0adhSqXL7cH3YIVdM0DUaKB/4QEcXF0FC8HjHP4xYNwPKwo1ClFKPSv6aZ4b0/EVGMVMqVsENQRgixWpOebAo7EFUq5XgkAEJoSJk88IeIKE7KCUoAACzWPCkTswUwLgsATT77JyKKHcd1ww5BpXZNCMFl6HXFqn9ERBS6xZr0pBF2FI0kZZqs+kdERGFr0QDJ0aiOTJMr/4mIKHRpzfOYANSLkTKhaVrYYRAREaU5GtUR7/6JiCgiTCYAdaLrBnRdDzsMIiIiAEgxAaiTya1/RERE0cAEoA40IaAbLPxDRETRwQSgDgwzzbI/REQUKawBUAc88pcoolI69NYMREsGWmvmpaeiZQfS8SCHy3CHipBFO9w4Z6Nr0BdlIRbnoKV1IG0AuoDwJLzxCryRMryrFchxK+xIKYKYAATMMFLQBCdaiKJAa83A6FgM45Y2pNa2QluaB6oozCVLNtwLY3COD8I6PgjvzChkCKXHtbYsUh2LYXQsgnHLosmkpYrpRVm04bwwAufUMOyTQ3BPXwWkDD5gijQmAAHj3T9RuIRpwNyyDOb2m2CsW1zTMRwim4Jx2yIYty1C5k0dkCUH1r5LqDx3Fu6Zq+qDvo6WN2HuWAnzrpXQlxdqakPkUkh1L0GqewmyALzhEio9F2D1XoDXP6E2YIoNJgABEpoGg4v/iEIhMgbS992MzP1rIbJqfw9F1kD6nlVI37MK7oUxVH57BpWd5wBX3V21vqYF2VffAqN7KYShdhZRa8si+/rbkH3drbD7+lF6/DjcC2NKr0HRxwQgQCYP/SGqO6FpSN9/MzKvuRUiF3wCrt/UhNy7u5F+9VqUf3IC1r5LvqbX9fYcMm9ZD3PzsqoeT/giBFK3L0WqewmsA5dR+sFReMOlYK9JkcEEICACnP4nqjdtWQGFP9wEfU1L3a+tt+eRf2QL0q9ei9L3DsM5PbKgnxcZA9m3rkf67tWAXud9Q0LA3LwcqfXtKP3gCCo7z3ONQANgAhAQ3UhBcPEfUd2kX7EG2Qe7IEKub2asbkHhz+5C5RcnUf7pyaoWCxq3LUL+PZugtWXrEOHsRMZA7vdvR2rTckx8bS9kyQk1HgoWR6iApDj9T1QfmkD2reuRe2hj6IP/FKFpyLx+HQp/cTf0JfnZv1EXyLxxHZr+9Z2hD/7XS21oR9NH74Xengs7FAoQZwACIISAYSj+p03pyhcCNRJZtgHOaCaOSGnIP7IVqe6lYYcyI2N1C5r+7b2Y+PJe2IcHXvZ3IpdC4Y+3w1jbGlJ0c9Pb8yj82T0Y/2wP3HOjYYdDAWACEADdSPlevCM0DeaOFUhtWwFjdStElm+VL56Ed7UM++ggKr89A/c8P9BiTwC5926O7OA/RZgGCh/ajuL3DqPy2zMAAG1RDoV/tR360jlmByJAazLR9JE7Mfb/PQv3CrcLJg1HlQCYKX8rj/VlBRQ+sBXastr2/NIMNAGtLTu5devuVaj89gyKjx5Wum2L6iv3jg0wNy8PO4zqaAK5hzZCX5pHZfcFFD60HVpTPB4TilwKhWtJgDdSDjscUohzyor5PfhHX1FA05/fw8E/SAJIv3INCh+8A9B4SkMcpe+7Gen7bg47jAVL33czmv/8ntgM/lO01gwKf3QHoHPISBK+m4oZPrb+iZSGwh9t53R/naQ2LkHmtbeGHQYtkL6sgNxb14cdRu1imnTqq5qRfdO6sMMghZgAKGYYtScA6XvXQFscnZXAjSDzmlshCvG6G2tkwtCQf3gLkNLDDqUhZR64FcZti8IOgxRhAqCQpunQ9do/mMwdKxVGQ9UQpg5z07Kww6AqmffdDP2mprDDaFwCyL27O7azGPRyTAAUMvws/kvp0G/ic/8wGLe0hR0CVUFkDWRfw0c2YdOX5pHmzUoiMAFQyE8CoBXM4Ot+04xEUzrsEKgKmftvqUttf5pf5g3rWJckAfgOKqIJDbpW+/S/rLDkZlhk2Q47BJqHMPVYrvpPKq0tA/OOFWGHQT4xAVDE1/Q/AFly4I1ZiqKhhfAus8BJ1KU2LYPIcHdMlHDNUvwxAVBE97H6HwAgJeyDl9UEQwvCf/foS9/JwSZqjFvboPGsgFhjAqDAZO1//9uSyk+8AOnMf3IYqWP39cNhnfNI01oyMNYtDjsMmk4ImNv4GCDOmAAoYPio/Hc9b6iI0g+PKGmL5ueNWSh+ty/sMGgexm2LAK6PjaTUOtYEiDMmAAqoSgAAoPLUGZR+dIwn1wXMGy5h/NO7WNs8BoxbonlaHgH6mlaWB44xrqrxK4Cjf8tPnIR9cgi5N3fAuG0x734UkiUHlefOovzzk5Alrv6PA+MW3mVGlTB16Cub4J65GnYoVAMmAD4ZuhHI/n331AjG/mEXRHMaxupmaIU0JKtv1c5y4Q2X4Jy+CrhcZxEbuoC+LNpH5jY64yYmAHHFBMAnPyf/VUOOVmD39Qd6DaKo0pozLDsbcaIlE3YIVCM+vPEppWD1PxHNTGtmlcao01lJM7aYAPigCQ3CR/U/Ipqb1sLBJeoE36PYYgLgQ9DT/0QNjzNs0WfySXJcMQHwweCZ5ETB4oLN6GPxsthiAlArAeg6ZwCIAuWwIEbkMUmLLSYANdI0A4LH9xIFyuPgEn0uk7S4YgJQI0Pn9D9R0OR4JewQaB4e36PYYgJQI7/H/xLR/LyBYtgh0Dy8fr5HccUEoCYCOmcAiAInyw7kuBV2GDQHl0labDEBqMHk4M/n/0T14A5MhB0CzcHt5/sTV0wAaqArPvyHiGbnnh8LOwSahaw4kIOlsMOgGjEBqIGuMQEgqhf7+GDYIdAsnOeHID3u1IgrJgA10FmdjKhunBODHGQiislZvDEBWCBN17n/n6iOZMmBe3Y07DBoBs6xobBDIB+YACyQwcN/iOrOPjoQdgg0jTdShnt5POwwyAcmAAukcQEgUd1Zuy4ALDgXKVbPeUDyTYkzJgALpOtMAIjqzRsqwnmez5sjQ8rJpIxijQnAAgihQdP4T0YUhspz58MOga5xnh9ifYYE4O3sAtS7+p++vABz6wroq1qgNZl1vXYgHA/eaAX28UFYey9CFu2wI6IYsQ9cgixtgMiyDHfYmIwlAxOABdDqlACIjIHcuzbA3L4ycQUHdQCpzcuQfct6lB4/hspTZ8IOiWJC2h4qT59B5nW3hR1KQ/OGS7D3Xwo7DFKA89kLUI8ZAC1vounP74G5I3mD//VE1kDunRuRe3d32KFQjJR/+QJkiTNHYSr//HlIh3UZkoAJwAJoQS8AFAK592+FvrwQ7HUiJH3vamTuWxt2GBQTsuSg/KvTYYfRsLzhEipc/JcYTACqJISAFnABoNTmZUitWxToNaIo86Z1EIUErHGguqj86hRPCAxJ+fETgMu7/6RgAlAlrQ71/9OvWBP4NaJIZAyY21aEHQbFhLQclJ98IewwGo53eRxW78WwwyCFmABUSdcD/qfSBVK3tAV7jQhLdSwOOwSKkcqvT8M9z/LAdSMlit89xDMZEoYJQJWCLgCkNaUBPcGr/uahtWbCDoFiRHoeit/uAzxWoquHyjPnYJ9g3f+kYQJQpcC3ALoN/kHW6K+fFsw5exWV33AbadDkaAWlHx8NOwwKABOAKgiIwCsAehMWpOUGeo0oc4eKYYdAMVT6yTF4g6Www0i0iX/ugyw5YYdBAWACUIW6FADyJOwjjXvimX24cV871U5aLorfOsBHAQGxei/APngl7DAoIEwAqqAFvQDwmsovX2jI07W8q2VWFqOa2SeGUHr8RNhhJI57aQzF7/SFHQYFiAlAFTStPiWAndMjjVdjWwLF7xxq6Mcf5F/5FydhH7gcdhiJIS0H41/ex9/LhGMCUIV6ngBY/O6hhvkgk543+XoPcYqRfJISE988AG+Aa0l8kxLFrx+Ed3k87EgoYEwAqqDXaQYAAOB6GP/SHhQfPZzo0/Lc82MY/1QPKr/lKm5SQ5YcjH9xD+9afar86jQsPpJrCDwNcD5CQIg650lystCJ9ew5GJ3tMFY1Q8vHv1SulBLe1Qqc44NwzowAjbfcgQLmXhxD8RsHkH94C6A1bl2NWtl9/Sj96FjYYVCdMAGYh6ZpoZ3KJy0X9oHLDfNIgEgFa98liFyKJ00ukHN6BBNf3ctqfw2EjwDmUdfpfyJSovLM2cmDa6gq7qUxjH+2l49PGgwTgHnUcwEgEalT+ukJlJ86FXYYkeeNlDH+md5ErzmimXF0m4fgDABRbJUePQJ7Hxe0zUaOWxj71C54I+WwQ6EQMAGYB2cAiGJMAuNf3YfKrgarr1EFb6yCsU/thNc/EXYoFBKObvOoVxVAIgqIJ1H85kFUnjoddiSR4Q2XMP73O+Fe5F7/RsZdAHMQQkCEtQWAiNSREsVHj0A6HjIP3BJ2NKFyr0xg/NOc9ifOAMyJz/+JEkRKlH54tKH3ubvnRzH2yec4+BMAzgDMSat3ASAiClz5iZOQtovcOzaEVuMjDM7JYYx/vpdH+9KLmADMQWMlMaJEqjx1Gm5/EYWHt0Bkk/8xaO2+gIlv9QE29/nTS3iLOwfuACBKLudIP0Y//gzcJK+C9yRKPzqGia/t5+BPN+AINwchuAaAKMm8/gmMfeJZOMcHww5FOVl2MP6FPSg/cTLsUCiimADMgY8AiJJPFm2M/2NvogZKd6CI0U88y6O2aU7Jf/jlA3cBEDUG6Xko/egY3KEScu/YAJGK772R3dePia/v42I/mhcTgFkIISA4AUDUUKxnzsI9OYz8I1ugr2gKO5wFkY6H8g+Pofyb04DkWds0PyYAsxBcAEhJpAukOtthdCyG1poFAHjDRTjHB+EcHeJRsADcy+MY+/gzyL61E+lXrUEc7gTcKxOY+OpeuOfHwg6FYoQJwCxYAZCSJtXVjty7NkJrz934l/ffAm+giOL3DsE+MlD/4CJG2h6K3z8M+8Qg8n+wCSKXCjukWVm9F1D8Th+P8qUF423uLLgFkJIk86qbUfjw9pkH/2u09hwKH96O9CvX1DGyaLMPXsHox56G8/xQ2KHcQJYcTHx1Hyb+aT8Hf6oJR7lZiBhM+xFVw+hsR/adXdVNZQuB3Ls2ILV+cfCBxYQ3UsbYp3ah9KNjkHY0HpHYxwYx+rGnYe25GHYoFGNMAGbBNQCUCJpA7nc3Luw5trj2M9wG+xJPovzESYz+3W9CrRkgSw4mvtOH8X/sgTdcCi0OSgaOcrPgOQCUBOaGpdDnmPafjbYkj9TGJQFEFG/eQBFjn+7BxNcPQBbtul7b2ncJV//217CeOctV/qQEFwHOQvDuhxLAvGdVzT+bvns17IMsJHMDKWH1nIdzdADZt3fC3H5ToJfzRisofvcQ7AOXA70ONR4mALMQnAGgmNNaMkh1tdf886mudmitGR4dOwtvrIKJf9oPa+8l5B7aCK01o/YCUsJ69hyKjx2FrLCoD6nHBGAWXARIcZe+a6W/5/iaQPrOlSj97Hl1QSWQfegKRl8YQuYN65B55RpA93/z4JweQfH7h+GeuaogQqKZMQGYiRBMACjehIC5Y6XvZsy7VqL08+cBPnKekyw5KD16BNbTZ5B5y3qYW5bX1I53tYzSj4/D6r3A5/wUOCYAM+DkP8VdqmPxnHv+q6UtyiHV0Q77GIsDVcMdKGLiy3tRWbcYuQe7oK+srpywtFxUfnMa5Z+dhLQ43U/1wQRgJtwCSDFn3uX/7v/6tpgALIxzYhCj//NpmNtXIvu29dCa0jN/o5Sw9l9G6bGj3NZHdccEYAbcAEBxJnIppG5fpqw9c/MyFAsm5LilrM2GIAGr5zzs/ZeQfuAWZB649WWnDDqnR1D8wRG4p0ZCDJIaGROAmXAHAMWYueMmtcfZ6hrMO1ag8uvT6tpsINJyUX78BCrPnEWqeyk004BzZgTOC8Nhh0YNjgnADHgQEMVZ+s7a9/7P2ubdq5gA+CRHK5NFfIgigre6M+EOAIop4+ZW6DepP8deX94E4+ZW5e0SUXiYAMxAYwJAMWXerf7uvx5tE1H9MQGYCdcAUAwJ04C5tbb959Uwty2HSPOpIVFScKSbAYsAURwFPUAHnWAQUX0xAZgBywBQHNVjip6PAYiSg0PdTCRnAChe6rVIL6hFhkRUf0wAZsBHABQ36TremQexzZCI6o8JAFHcXSvUUy/KCw0RUSj4WzwDzgBQnJibl0EUzLpdT3WpYSIKBxOAmTABoBhRefBPlK9JRGoxAZgBx3+Ki6njeutN1XHDRBQeJgDTiRf/QxR55l0rw+muQsDcwVkAojhjAjANh36KDU0gfWd4g3D6rpU8O5soxpgATMf5f4qJVNcSaK2Z0K6vtWSQ6qr/4wciUoMJwDQ8CpjiIu1zIZ43UoY3UvYXw92rff08EYWHCQBRDGlNJlIbl/pqw9p1HpVd5321YWxsh2hO+2qDiMLBBGA6PgKgGDDvXAXoPvqqlKj0nIe18zwga29GaBrSXAxIFEtMAIhiyPS5+M8+PgRvoAhvqAj7+ICvttJ3r2LiTBRDTACmET7uhojqwbhtEfSleV9tWM+de+nPO/09BtDaczBubfPVBhHVHxOA6XgjQxHn9+AfWbRhH7z84v9b+y9DjluhxkREFOr9kgAAIABJREFU9ccE4AbMACi6RNZAapO/OvyVnvOQjvfSF1wP1u6Lvto0Ny+DyKZ8tUFE9cUEgChGzDtugjB1X23MNOVfue6RQE1Sel1PJCQi/5gAEMWI36l299QI3ItjN3790hic0yO+2k7fy5oARHHCBIAoJvRVzdBXNvtqozzHnb7lcxZAX9EEfZW/+IiofpgATMPdTBRVvhf/WQ7sfZdm/XtrzyXIiuPrGlwMSBQfTABuwAyAIiilw9x2k68mrN1zD/DScmDtnT1BqIa5zf8aBSKqDyYA07EQAEVQeutyiKzhqw1r5/xT/H4fA4isAXPLcl9tEFF9MAGYTnIGgKLHvMvn4r8qF/k5p0fgXrhxkeBC+I2ViOqDCcA0khMAFDHakjyMW1p9tWE9W321v8ouf7MAxq1t0JYVfLVBRMFjAjCN4CMAihjftfZdD5U9F6r+dqvnwssLBdUg7fOsAiIKHhMAoggTmgZzh8/Ffwss9Tu9VHAt0neu9HdaIREFjgnANHwEQFFi3L4EWlPaVxu1HPbjezFgwYTZvdRXG0QULCYARBGW8bmvvtbjfqeOC/bDvIuVAYmijAnADTgFQNGgtWZgrG/31Ya183xtXVpKVHr8HROc6mqH1pb11QYRBYcJwA343JKiIX3XKkDz0R89icqu2gdxa+d5wPOREAvA3MHFgERRxQTgBpwBoAgQ/vfT20f64Y2Ua/5572oZ9pGFPz64Xvoen0kMEQWGCcA0kjMA0SYA0ZyGvqIJojmd2MMbjPXt0NoyvtrwfcQvgMpzZ339vNaagdGx2HcckdQgfZGSy19tUaI60ZrTyLzmNqS2LofWZL74dTlagbXvEkpPnIQcrYQYoVp+D9XxxiqwD/f7jsM+3A9vrOJrJ0L67lVwjvqbSYiS2fqiN1aBvTd5fZGSiwnANIL7ACPH3LYCuXd3Q2Ru7K6iOY30fTfD3LESE98+OOdpd3Gh5U2Yt/vbQmftOg+4CvqyK2HtOo/Ma26tuQnz9qUoFswF1SKIKnPbCuQe6p7xXAat6aW+WPxOH6y9F0OIkKh6fAQwDYf/aEltWY78ezfPOPhfT2QNFB7ekoiDaMwdKwHdx6+mlL738V/Peu6cvwIZuob09vgvBjSn+uI8hzKJrIH8+zYjlYC+SMnGBGA6PsaLDP2mJhTes6n6RWSaQO49m6Gvag42sICZd/sbLJ2Tw3B97uG/njtQhHNy2Fcb5j0+yxmHTF/RhNwfLqwv5hPQFynZmABMxymASBBZA4UP3gGkFna2vEhpKHzwDohcKqDIgmWsbYPu8yAdFYv/VLepL83DuLlFUTT1NdkXt0GYjdUXKfmYANyAGUDohED+DzZBW1xbERmtLYP8ezbF8o7T792/LDmwD/ir4z8Ta/9lyJLtqw3z7hhWBpzqi+25mn48zn2Rko8JAEVO5rW3IrVpma82UhuXIvPALYoiqg9hGr7XMFR6z0NarqKIrmO7sHb7W9Rmbl0+71qOqMm+5hYlfTH7mnj1RWoMTAAoUox1i5F94zolbWXfsh6p9fHZg57avgIi7W+ArOXgn2pVnvFXE0CYOlLbViiKJnjGbYuQfpOavph5c7z6IjUGJgDTcRtgaLSmNArv26yucpwA8u/bAq3FX0Gdesn4rPznnL0K9/yoomhu5F4cg3vOX/t+X2O9aE1pFB7eAqEp+oiMWV+kxsAEYBoO/+EQmob8+7dOVlRT2W7BROH9W/1tq6sDfUUB+hp/i+RUbv2bje/FgGtaoK9sUhRNMILsi/kPRL8vUuNgT5yGCUA4sm/vhHFrWyBt62tbkX1rRyBtq5L2u0DOdutSeMbac8H3GoP0ndGeBci8fX1gfdG4uRXZt60PpG2ihWICcAOmAPVmdi9D+r41gV4j8ztrI1skSBgaUnf4ezZu7b0EWXIURTQ7WXJg+ay2aO5YueDtnfVidi9D5r6bA71GlPsiNRYmANNJMAeoI709h1w9tkkJgdwf3g7N5x77IKQ2L4OWN+f/xjkEsfd/NtZOf9cSWQPmJn+ljoNQt74IRLYvUmNhAjAjZgB1kdKRf/+2eUurqiJMA4X3b1lwQZeg+d0f7/ZPwDk1oiia+Tknh+FdHvfVRuRqAoTRF/9om+9dH0R+MAGYATcC1EfuoY11XxCmL29C7vdvr+s156ItyiF12yJfbVjP+qzVX4PKLn/bDVO3tUFvzyuKxr9Q+uKSPHK/113XaxJdjwnAjJgBBC39ijVI3xnOATHmthVI3xuNO9D03St9nT8hPQ9W7wV1AVXJ6vF52qAQMO+8SV1APoTeF18R7PoXotkwAZgRE4AgGatbkH1HV6gx5N61Efra1lBjEJoG0+/e/4P98Mbqf/a8N2bB6rviqw3z7lXq9tnXKBJ98Z0bYITcF6kxMQGYAYf/4IhcCvn3b4EwQu56ukDh4S2+F9/5YWxoh+Zzr3m5jov/prN2+qsMqDWlYWwIrzqeyEanL+Yf2RpqX6TGxARgJlwEEAwBFN63Gdqi2g5WUU1ryyL3sMLKgwuUvtvf3b83UoZzbEBRNAtnHxmAN1zy1Ybp89+gZgIoPByhvtiaQf6RLaH1RWpMTABmwOE/GNnXr4PRtSTsMF4mtb4dmdfeWvfrak1ppHz+W1R2ngO8EHurvLYWwIfUhiW+Z0FqkXld9Pqi0bEY2dfdFnYY1ECYAMyEMwDKGZ3tyLxBzcEq8CTKj59QNvhl39hR94Na0netBHQ/q//878dXofLcOV8Zs9C0ui/AS61Xd+CU6r6YecM6GJ3tStoimg8TgBlw+FdLa80g/77Nvla7X6/8L8dR+ukJlB4/oaZBgclnsG1ZNe3Nez2B1F3+Bj37WD+84bKigGrnDft/DGHevbouxXeAqb64JdJ9sfDwlvr1RWpoTABmwgxAHV0g/4i6xXb2oSsoPfECAKD8i5OwD1xW0q7Ipep2aJCKPfDWc8Ed+7tQfhciaouzMHzWQqjKtb4oCvHoi6EvTqTEYw+bgWQGoEzuHRtgrFVzsIo3XMbE1w+89IhGSkx88wC8QX8L0aboa1qQe3vwW8L8VsGTRRu2zy14KtkHr0COW77aSN8d/GOA7INdseqL2QfD3Z5IyccEYEZMAFQwt61A+pVqipxI28P4F3dDFu2Xf73kYPyLuwHb3wl1U9L3rYG5PbgCNSrq4Fs7z0M6nqKIFHA9VHp9LgbctBwil1IU0I3MrSuQeZWaQ37q1hdfuWby4CSigDABmIGM0GdrXKkuc1r87iG450Zn/Dv3whiK3zus7Fq5d3dDXx7MQS0qTsKrRGDx33R+yxGLlAZzu78TEWcT67740MbA+iIRE4AZcQbAD2EayCs86KTSe2HeFe+V584pGxiFqaPwwW0QGfUHtaTv9Fn579QwXJ8H8QTBvTIB5/RVX22k71ZfEvfFvqjovbR2V9sX1azRCLIvEjEBmIHkNkBfsu/eCF3RUafuxTGUvtNX1feWvnsIzix3ZgulLckjr/jQIH1Ni+8DZ6K0+G866zl/lQH1FQUYq1sURTNJdV8sfrvavtgX6b5IBDABmBkTgJpl7luLtKJn6LLiYOJLeyGt6p6pSttD8Sv7IEuOkuuntixH+j41z40BIOOz7r+0HFh7LymKRj1r7yXIsr9/e5WVAZPWFzP3rVXSFtEUJgAz4BKA2hg3tyL79vVqGpMSxW8cgNs/saAfcwcmMPH1fcqSuNzbu2Dc4n/luDB1pLb5e8Zt9V6EtNQMKEGQlgt7z0VfbZjbV0CY/qe7k9gXs2/vVNIXiaYwAZgJZwAWTBRM5BXuoy8/+QKs/bXtq7b7+lH55SklcUAXyD/sf++4uXWF7+e4VogH/1Sr7HMdhjANmFuX+2sjl0L+kYT2xQ9shQihdDIlExOAGUhuA1gYARTeuxlaa0ZJc87zQyj/xF9lteKPj8FWdFDO5EEtW30d1GL63OfuXhyHc9bfIrt6cM9chXt+zFcbvv6tBJB/eDO0toT2xaY0Cu8L7wArShYmAORb9k0dyuqXe2MWJr66D9LzmYR5EsV/2g9vtKIkrtS6RTWfZaAvycO42d9575Xnzvj6+Xqq7PI3C2Csbat54V72TR1Idao55Ed5X7yqpnSzsU7hWQbU0JgAzMDjI4CqpTYuQea1ak4wk56Hia/sVTZoe2MWxr+0B3AVPYN93a0wu5ct+OfS9/irdS9tD1avv2fr9WT1nPddDCddw4LJ1Ib2aPfFL+9V1hczr70Vqdv9FZQiYgIwEyYAVdHassi/R90hP6UfHYPz/JCaxq5xT42g9ONjahoTArn33A5t8QIOatE1mDv8rUS3D1y6oepclMmSA+uAv1LFqTtvWlAtfK0ti1yD9cX8H25aWF8kmoYJwAx4FsD8hKFNLkhSVL7V7ruCyq9OK2lruvKvTsGucRHXdCKbQuGDd1Rdzc+8fanvBYSVCO/9n43fmgBa3kRqY3V3uFN9UdmBUwH3RWu/mq2cC+2LRNMxAZiJfPE/NIvsuzYqK9oyuV1qf3AzL1Ji4hsH4F5Z2Dau2eg3NSH3juoOavG7+M8bLCm/E60H+/lhuAP+/r2rrQmQe+eGWPXF4jcOKu2L+Sr7ItF0TABmwY0AszPvWIH0PWoKtkjbw8SX1RVMmfU6FQcTX95TdSGX+aTvXQ3zzrkHd601g1SHv8WR1nNn4/lISkpYuy74aiLV2T7van7zjhUw7/V3uuKUuPZF897VNa2ZIGICMAspYvihWwf6igJyv6euLGnxn/vgnldTMnU+7sVxFL99UFl7uYe6oa9snvXvzbtX+dquJT0PlV3xm/6fYj13zt8KegGYcwxs7Isvyf7uxjn7ItFMmADMxmMCMJ1IG8i/fxuEqeaZY+WZs7DqPMBZuy/Cesbf8+kpIqUh//4tENkZCvwIBQf/HB5Qtgo9DN5YBc7hQV9tpO+aOYliX3y5Ofsi0SyYAMyC4/8011Yd60vzSppzL4yh+OgRJW0tVPH7h5UV1dHb89d2Qrx8kDI6l/guRlOJQeW/+fitXqi1ZpBav/jlX2RfnNFkX9zia8spNRYmALPhIoCXybx6LVKbF74HfiayZGP8i7t97xWv+fqON3mwi6KtdanupUjf//JDgzI+D7Xxxiqwj/T7aiMK7MP9vmcxpi8GzNyfvL7oTVhK2kt1L0Hm1WuVtEXJxwRgFpJHAr1IX9uK7JsVHqzy9YPwBktq2quRN1y6ttpbTXvZt66HcdsiAJNb2IyN/qrRWc+dU1Y0Jkwq1jGY3S9tpdTXtiL7FnV9ceIbByLRF4sK+2LmLR0v9kWiuTABmIXkMwAAgNZkovCBbYCuZlqx9POTsPrU7Mn3yz7Uj/IvnlfSltA05B/ZCq05DfOulQsqYnMDBSvoo8T3TgZdQ3rHykD6on3QX8EiVezDA4H0RaK5MAGYBcsBq/8gsY8NoPxTfwerqFZ6/ASc4/4Wqk3RmkzkH94y58r1ajjPD/neQx8lKmoZmHevUtoXneODkeyL6g4NmuyLQuNHPM2OvWM2TACUTiV6I2VMfG1/9FZXehLjX90Hb0TRQS23LfK9OC0Ji/+m81vNUF+aV9YX5Wglsn1x4iv74A2r64uZt3QoaYuSiQnALGSDJwBKFxO5cvJUtXE1C51Uk+MWJr68F3DDX/ehoo5+FEXmPANXYvzLe+GNRXN7pSzamPiKur6ocvEuJQ8TgFk08iMA1duJio8dgfPCsJK2guKcHkHpMUUHtfig4iS9KIrKiYYN1xcVb5mkZGECMAvZoNsARUpD7hF1BUXsfZdQeSqYg1VUKz91CpXecBffVXYlb/p/SuW5M6Fev1H7ouqiSZQcTABm06AzANnf3QhjlZqSol7/BCa+pa7caT2UvnMI7uXxUK7tnrkK9/xYKNeuB/fiuLKiNwvV6H1xsmxyt5K2KDmYAMxicg1AYyUB6XtWKTtURFouxr+4B7Ic7MEqqknLwcQX9kBW6h93eWdy7/6n+K0MWIvY90VFcZt33KTsEC9KBiYAc4jaIuEg6Tc1IffODcraK36nD+6lcO6k/XL7J1D8dl9dryktF/ae8J+RB83qvQhp1XcgLv7zIfbFa7Lv2ghd0QwfxV+iTo4YuqWAqxvVDWKFYQkzeeuxbiAB5N7aCaTUPCMs/+Y0rJCfpftl7bkI45Y2pF+5pj7X23sxdneotZCWA2vvpbodX1t5+szkwsoYs/ZehH5LKzKvunn+b56HMDQUPrAVxR8eA08MWLhyIVn3zIlKAJ7f0oTe5U3K2luSbccindW0FsI9cxWlHxwNOwwlio8ehr6yCcbatsCvFcbUeFis587XJQGY7IvhHPKjWukHR2CsalbSF7VFORTev1VBVI1n6EQEtrIqlKx0RrGi1wC3/wrJoo3xiOynV8K9VphF0UEts17mygSc0+EsjguDc2o48IWWU31ROsnqi1GtpUHxxARgDsUG3QpYEwlMfG0fvOFwD1ZRzRspY+Ir+wJdEGI9e67hdp1UglzwmOC+OP7VYPsiNRYmAHMoSc4AVKv0+HHYR9TUMY8a5/ggyj9Tc1DLDVwPld54P6OuhbXzfGB356XHTyS6L5Z+GlBfpIbDBGAOnAGojn1sAOVfnAw7jECVfnYCzpF+5e3aB6805LSuLNqw+9SXPHaODyo7VS+qyj8Ppi9S42ECMIciZwDm5Q2XUPxqBA9WUU0C41/bD2+oqLTZcgMt/ptO9cLHejyuiQQJjH9VfV+kxsMEYA4lLgKcm3vtJL2AF8lFhSzamPjyPmVT195IWdlRxHFkHxtQdvLd5CK5vY3TF0tq+yI1JiYAcyiCv1xzKX7vENxTI2GHUVfO2asoPapma5n13Lnk363ORao7+6D4/cNw2BeJFoQJwBwc6cHiOoAZWXsuovLM2bDDCEXlt2dQ2eVz4Z7CwS/OVCRB1p6LqPw23IOGwqKkL1LDYgIwjxITgBu4l8ZQjNnBKqoV//mQr4N7nKP96qa/Y8wbKcM+VvtjEPZF/32RGhcTgHlwIeDLyYqDiS/uhbQa/N/FdjHxlb01HxpUfroxZ09mUvltbUf0si9e47MvUuNiAjAPbgW8jpQofuMg3P6JsCOJBLd/AsVvLvzu03l+CPZhbuOaYh8agHNqeME/V/wm++IUt38CxW8cbLiCUuQPE4B5sBjQS8o/OQ5r/6Www4gUa98llBZQJMgdmMDE1/bzg/p68lrJ5YHqt7WVf/Y8rH3si9ez9l9C+SfHww6DYoQJwDx4HsDkUbXF7x5CKeHFfmpV/pfjKD52ZN6paOfUCMb/YRe8q3z2P503UsbYP+ycd1eJtFyUfnAUpX/hQDeT0i9Oovj9Q3wsQlVJ1GmAQWjYNQBSwhsuwdp/GZWnz7LoyDwqvzwFe88lZB64Fan1i6AtKwCYHLCcE4Oo9FyAvf8y7/zn4I2UMfr3z8HcuhzmHTfBWLcIwtQn++KVCdjHBlF+8gUmUPOoPHUGdt8AMq9cg9TmpdDasoDg4b90I/HM07sS84n06e9+B8+PqC0vargCrdJU2mbkeYA3WknOqX4hEKYBQPJOzCdh6gAEpMUFbjXTNWjNac73KnD/PXfiTQ+8MuwwlEnUDEBm1EHq+JDSNjUh4DW1KG2Tko8DlhpMoBRwvcSdjBgWw0nM/TIA5oTz8iCRrLeciIiICcD8JACPU+FERJQsTACq4DIBICKihGECUAXJBICIiBKGCUAVPFYDJCKihGECUAXP5UpkIiJKFiYAVeAMABERJQ0TgCp4XANAREQJwwSgGlLCYwlXIiJKECYAVeJOACIiShImAFXiQkAiIkoSJgBV4kJAIiJKEiYAVZIeZwCIiCg5EpUABLlOz/W4CJCIqJEJiLBDUCpRCUDaNANrmzMARESNLWUaYYegVLISgEw6sLallJCcBSAialiZAMeYMCQqASjkc4G273IWgIioYeVywY4x9ZaoBGDl6pWBts/HAEREjWvJkrawQ1AqUQnArbeuQZBrNDgDQETUmIQQWLSYCUBkZbMZmKngFgJ6LmsBEBE1ouUrliCV4iLASFu6tD2wtj3PCaxtIiKKrnXr1oYdgnKJSwDWd3UE1raUPBOAiKgRretYG3YIyiUuAbjvVXdDE8G9LK4DICJqLLlcFh3r14YdhnKJSwDMtInlK5YF1j4PBSIiaixbt22Eruthh6Fc4hIAAHjt638nsLY9PgIgImoYQgjc84o7wg4jEIlMALq6OtDa2hpI23wEQETUODZt7sSyZcEtLg9TIhMAAHjzW18bSLue54IFgYmIkk/TNLz2da8KO4zAJDYBuP32DVh50wr1DUtAch0AEVHiveJV27F8xZKwwwhMYhMAAHjf+38PWgALNzw+BiAiSrSW1ma8/g33hR1GoBKdALS0NONtb3uj8nZdzgAQESWWpml4z3sfTNzpf9MlOgEAgLvvuQNdXeuVtum6rAhIRJRUb3rz/bjl1tVhhxG4xCcAAPDIB34fq1bdpKw91/UALgUkIkqcu+/ZhvsfuCfsMOqiIRIAAPjIn3wQixapOslJsiAQEVHCbN22Ee/83TeEHUbdNEwCoGka/vLf/QlWKNoZwHUARETJ8YpXbscfvvdBaFrDDIuNkwAAk0nAn/35H2Nj9wYAwldbTACIiOJP0zW87cHX4h3vegOE8DcuxI145uldDfkwu7dnHx599CdwndoW9GmajnyhSXFURERUL21tLXjvI+/EmjXq1ojFScMmAABQnCjhm9/8Pk6ceL6mNX2FppaGyxiJiOJO0zXce+8deOOb70c6bYYdTmgaOgGYcuLEC/jhDx5Hf/8gFpIJ5HJ56EYquMCIiEgZTdewbVs3XvO6V6K9XdWi8PhiAnCd06fO4ec/+yVOnzlX1aOBdDoDM52pQ2RERFSr1rZm3HHH7bjz7i1YtCiYg+LiiAnADDzXw549B3Dw4GGcO3cBpVIZcoZjgA0jhWwuH0KEREQ0m0wmjRU3LcO6jpuxfv0tWL3mJj6unQETgCpdungZZ06fx+j4OMqlMizLhmmm0Nl1W9ihERE1NCNlIJ0xkctm0d7ehqbmQtghxYIRdgBxsXzFMixfseyGrze35qHrDbWbkoiIEoAjl0+OzXoAREQUP0wAfHIcJgBERBQ/TAB8cpkAEBFRDDEB8Ml1PXgz7BAgIiKKMiYACnAdABERxQ0TAAVsJgBERBQzTAAUsK3aDhQiIiIKCxMABaSUXAxIRESxwgRAEcfhQkAiIooPJgCK2DYfAxARUXwwAVDEthxInqpAREQxwQRAIa4DICKiuGACoJDF3QBERBQTGs9IVsfhOgAiIooHW5N8cK0MywITEVFMWJqmCWYACrEoEBERxUBFA5gAqMR1AEREFAMVDQCXrivkOh48jzkVERFF2lVN07Ry2FEkiZSSRYGIiCjqBjRAFsOOImnsih12CERERHMZ1IQmxsKOImkcxwV3VxARUYQNagAuhR1F0kjJ3QBERBRdUsqzmia058MOJIm4G4CIiCLslCZ0cSjsKJLIsfkYgIiIIusFTQhtV9hRJJGUko8BiIgokqSUp4xUSjxdCjuShKpUbJjpVNhhVMXzvMkaBlICQU1cCEATApquQdd5DpVKruvBe7EUdVDne0homsb3TzEpJTxPTr5/dfj90w0Nmsb3r8GNb9iw4YzR3d1t7Xpu94TjuPmwI0oa1/EgpUQUD1wqly1MjJdRLFZgVWy4bn3PMNA0gZSZQjaTQq6QRT6fjuS/UxRJKVEqVjAxUUa5ZKFScep+BoWmaTBNA9lcGvlCBtmsyfevSlJKTEyUUZyooFSyYFXsuj8u1HUNZjqF3LX3L5Mx63p9Ct0BIYQ0AAAC5wGsDzee5JFSwqo4SGeiMQsgpcTVkQmMjEzACrlWgedJVMoWKmULIyMT0HQNLS05tC1qgmHoocYWVa7rXXv/xuHY4Rbw9DwP5bKFctnC8NAYUikDLa15tLTmOTswC8dxMTw0jqtXJ+DVOeGeznU9lIoVlIoVDA6Mwkyn0NZWQHNLjolcAxBCHAAAAwA0oR0EXCYAAbAqdiQSgLGxEvqvjIQ+cMzGcz0MD41jZHgCbYuasGhxEzSNH0TAS4nb4MBo3WdqqmXbDgb6r2JocBTtS1rQ0prnQHKNlBKDA6MYHhqP7MJgq2Lj8qVhDA2OYcnSFhSasmGHRAHyPO8AAEym6hp+GGo0CeY4LlwnvEHXdT1cOD+Ii+cHIzv4X09KiaHBUZw5dRkVVlSEbTs4d6YfVy6PRHbwv57nSVy5PIJzZwdi0d+CVilbOPXCZQwNjkV28L+ebTuTnxcXhni0eYJJKX8LXEsApHS+GW44yWZVwtkNYNsOzpy+gvGx+C3ztCwHZ2MauyqlkoUzp66gVLLCDmXBSsUKTp++gnI5frGrMj5ewpnT/bHcDTQ2WsSZU1dgM4lLovHLly/vB64lADt27Cgahj4SbkzJVanYqHfyb9suzsb0w2eK50lcvDCEsdHGO66iVKzg/Nn+WNz1z8Z1XJw7049SsRJ2KHU3erWIi+eHYnHXP5upJJxFzZJFSvnsAw884ABTjwAACE0cDC+kZJusCVC/6WzX9XDubD+cEB89qCKlxKWLQyhONM6hlZWKjQvnBxNxrLTnSVw4P9hQg8jEeBmXL8V78J/iOC4unBtIxGcJTdI07akX/zz1B11oXw8nnMZQr+fZUkpcPD8Y6zv/6aQELpwfbIjpSM+TuHh+KNZ3/tO5rofzZwca4pmybTu4dHGo7jN+QbIsB5cuJCOhIUAI8fjUn19MAAotuc8JEVgJiobn2G5dtv6MDE+gmMApV8+TuHxxKOwwAtd/ZQRWHWeL6sW2HfRfuRp2GIG7fHE4UcnblGKxgpHhibDDIP8GOjo6eqb+58UEoKOjo6Lr+vlwYmoMQS+IchwXgwPJ/ZAtFisYG03uosBy2cLo1eSudxi9Wkz0osDRq8VEJt9TorywxM/QAAAXzElEQVQNlar2UyHEi1OpL6vYoevisfrH0zisih1cmU8AQ4NjiXhuPJckJzgD/VcTPc06tR8+iZL82qZ4noehwbGwwyAfhHj5GP+yBMCD+9/qG05jkRKoBDS963mTxWKSzrKcRG4NrJRtFCeSe/c4ZWK8nMj6DuPjZdh2ctbdzGZkeJyzAPFVdBznZTV/XpYA7Nix42IqZVyob0yNpVIO5sNvbLSY6LvH6129mrxEZ3Q0ea9pNqNJfP8S+JpmIqVMZALeIH7Y3d09fv0Xbijarevat+sXT+NxHTeQCmmNtFe+OFFJ3KOO8bHG2eaYtNfqeR4mxpP1muYyPs4EII6klN+a/rUbT+3QvL8WQiTr0zViyiW1U71SylhWi6vV1Gl4SWHbbkNMH0+xbSdRrzfJC/9mUipWGma2MUEGDcO4oeT/DQnAtm3bRgxD21+fmBqTbbtKC2tYFafhfiGT9BxZdUIYB0E9CgtDkl5LNTxPJqrOSCOQUn6po6Pjhg+aGc/t1FOp/xh8SI1N5YeGlaC7qWolaa98I1XJm5Kk15yk11KtRnzNceZ53udn+vqMCcC2bZt+pBtasve0hMyq2MqeY4d52mBYXCc5K5EbcVW16yanzybptVSrEftsXEkpf93d3d0309/NmAAAgJFK/a/gQiJA3dRv0hbEVSNJZWVlQ75/yXnNjfn+Jef3L+mEEB+b7e9mTQC2bdv0nzVNa5yVZSGolNXMAgihIJiYEUl60Ql6KdVK1vuXoNdSrUZ8zfF0rLOz84bFf1NmTQCEEI5h6N8NJiaaomIWQNNmfRsTK0mvWdMa78M0Sa9ZT9BrqZaeoN+/JJNSfkwIMet0zZzvou3mPyI00XgPuOrIqji+p9NSKV1RNPGRMo2wQ1AmlUrOa6lWkl6zkaDXUq1G/MyJoTOGYXxprm+YMwG4556OUcPQbygeQOpIKVEu+VvRbqZTiqKJDzNBCUAjvn9JSuDSDfj+NWKfjRshxH+baevf9eafxxHuhzVdS86eqwia3BFQ+yyAYegNl5Fnc+mwQ1AmmzWT9Ux8HkIIZDJm2GEok6S+WA3TNKDrfAQQcc+PjY3NefcPVJEA7Nixo5gytM+qiYlmMjkL4G+9Zb6QVRRN9KVSeqJmAIQQDTWI5HLpRK0BME0jUY805pPPZ8IOgeYhhPhPO3bsmPfGvao0btv2rX/GugDBqpRteD721jY35xRGE21NCXytfP/iLYmvaTZNLY3zWmPqt+vXr/9mNd9YVQIghPB0of+pv5hoPn5qimeyZqKmVWcjBNDSWgg7DOWamrMNMa1qGDqampM3W9XSIINiOpNqiM+ZGPOEEB+t9jyfqj9xtt+19asp0zhRe1w0H9tyfJ0UuGhxk8JooqmpOZfI9Q5CCLQtSv7719pWSOR6h5RpoLkBkoDFi5vDDoHm9vnOzs5d1X7zwm45hPsmTdNYAipAfmYBCk1Z5BL8LFnTBNqXtIQdRmBa2wqJfpZsmgbaFiVv9mZKe3tLotY2TJfLpVFoSt7sTYJcsizrrxbyAwtKAHbs2PF8KqV/cmEx0UK4jgvLx0l3S5e1JvIOCwDal7TAMJJ39z9F0wSWLm8NO4xACCGwJMF9EwCMlJ7YBFUIgaXL28IOg+b2F5s3bx5eyA8s+KHjHTu2/oWRMi4v9OeoesWJSs0lgs10CssS+ItaaMqitS25d49T8vlMIh/ltC0qNMTq8da2QiLvkpctb0vUzpsEerSrq+vbC/2hmlYdpTO5V89VXpD88bstsLkll6hBJJM1seKmRWGHUTeL25sTtaq8uTmHxe2N8+x4xU2LkM0mZ6Hc4vbmhljfEGNXbNv+SC0/WFMCsHlz5xEzY/yXWn6WqlMpW3B8HPPbvqQlEUlANmti1eoliZ46nk4IgeUr2tCUgDvJpuYclq1oa7j3b+WqdmQSkAQsWtzcUMlbDElN0z60adOmmmblff1W9vbs2WdVnM1+2qDZGYbue8/tyPA4+q9chZTxO7K0qTmL5SsWNdTgcT0pJQb6RzE8NBZ2KDWZHDyaGvr9u3RxGGOjxbBDWTAhBJYua0VLaz7sUGhu/29XV9df1vrDvh7qGCntFY4jLnqujP+tZgQ5jotK2ULax77b1rYCMlkTly8Oo+JjcWE9adrkgrGWlsb+8BFCYMnSFuRyaVy5PALbdsIOqSpGSsey5W0N8cx/LkKIyccBOROD/aNwfRT6qqd0xsTyFW0NecZBzDzjuu6/99OA79R8z849Wyuu2ys9mfwqJiFpbs0rKRIzMjyOoaExX7UGgqRpAs0teSxe3AQ9wav9ayGlxNDgGIaHxmpeIBo0TdfQ1lbAosWNe9c/G8dxMTQ4hqsjE5GdjUulJrdpNsJi27gTQlwGsL2zs/O8r3ZUBLN7976/qJSsj6toi26UShkoKKqeJqXE+FgZo6MTKE5UIvFhlMmYaGrOobkl1xDV8PzwPA9joyWMjhZRLlmReP9yuTSamnNoas4leh+8Cq7rYfTqBEZHS6iU/Z3/oYIQAvl8BoXmLJqaskzc4sESQryus7PzKb8NKXu3d/fu/VylbH9IVXv0cvlCRvkRnJ4nUS5bsCo2LMuB53rBDyhCQNMEUqYB0zSQyZiJ3tsfJNf1UCpVYFsObNuF67pA0PmAENB1DanU5PuXzZnQNCZttXBdD6ViBZblwLadyZmdgH//hBDQdA2macBMT5b1ZdIWK1JK+UcbNmyY96S/aih953t27v61bbv3qWyTJgkh0Nya5y8rEVGDEkL8dWdn5/+lrD1VDQGAlFLr3bXnmG27t6lslyYZho5CM6fpiIga0Oc7Ozs/XO1BP9VQOncnhPCy+fRGI6WfUdkuTZrcFRCPlfxERKSGlPJ7Fy9e/IjKwR9QPAMwpaenJ+e52guu4y4Nov1G19SS43NzIqLG8FNd1x/s6Oio/aS4WQQ2l9zX17eoOF456jhue1DXaFSarqG5JcdHAUREyfaTfD7/0OrVq0tBNB7Y8t3u7u6hXCF9Sypl+NqnSDfyXA/F8XLYYRARUXB+oOv6u4Ia/IEAZwCmPPnkk5lCvrXPsZ1bg75Wo8nlM0hnWK2LiChJhBBfXL9+/YeFEIFWbavLHLKUUtvds/cJy3Lur8f1GoUQAoWmLIwU1wMQESXEJzo7Oz+qesHfTOpSwUMI4W2/c9ur05nU5+txvUYhpcTEeAmeF48a40RENCtHSvmvu7q6/k09Bn+gTjMA19uzZ/9fWRX7bzzXY/kwRVgfgIgo1voB/EFXV9eT9bxoKCPGnj177rQq3hOe6/HUCUVSpoFCAs6PJyJqMLullA9t2LDhVL0vHMpd+LZt23aZaW11yjQOh3H9JLItB6Wi8m2iREQUnH/Qdf0VYQz+QEgzANfbvXvv31pl56+klKHHkgS5QobneBMRRdsAgA93dXU9GmYQkRh09+/fv71cdH7quu6isGNJgkJzDinuDCAiiqKfAvijrq6uC2EHEokEYEpv797/4djuv+ECQf+amnPcHkhEFB0jUsp/39XV9Zl6rfKfT6QSAADo7e3d7LniMcd214QdS5wJATS15KHrzKWIiMIkhPi6rusfXbdu3ZWwY7le5BKAKb279nzUdb3/7roel7bXSNMECs05JgFERCGQUu7Rdf2j69ev/3XYscwksgkAAPT19Znlsv15u+K8R0rJUawGmibQ1JyDxiSAiKheLgoh/sv69es/J4SIbKW2SCcAU5599nhzOjXxyUrFeS8TgYXTdG0yCdBi8XYTEcXVAIC/y+fznwjyEB9VYjUi9PT0rNBE6nOWZb9RekwEFkLTNPz/7d1bjF3VfQbw77/23uc+M1AoSkmjViqoQpZSVa2qPjQPU19A9pyZYyjHCQapeSCJitIHVPFgtdL0gSaNSJS0VSJREiB4bDNqA74MBJHUoUBakthKQklBIW1o6xolwQFf5szZe6+1+uDQuPaMaw9n5r/3Xt/vzfMw8+n46KzvrL0uYxNNGMOXjYhoxI4B+Ctr7Wc3bNhwWjvMpSpVAXjbSy+91BkOsk/nud1prWto5ykLYww6402uCSAiGo0XvfefdM7t3bBhQ6od5nKVsgCc68g3vn37MMs+L0BNO0sZiAg6403EMbcIEhFdLu89lgbpD9ud5p3XX3/9V4uypW81Sl8AAGDv3IF74WTXNe+6Eu12A96X9v9j3XTGm0iSWDsGEVHhee8xGKQ4dXIRp08NYL3tTU9vVj3FbxQqMQKkeetTYk/u+q//OLvFstms4+prrkCrVWcZWMHpkwO0Ow3UeGwwEdEFvPdYXBzizKkBTp0awNr/Xcw/qDfdVzSzjUolZgAAYPfD+4/b3L7r/J9HcYxfvHoc7bEm4iSCdywE52o0a2i26toxiIhUee+RpfnZQf/MEhbPDJf9AinwB7q9zTMKEUeuEjMAAGBi86TN7QfP/7nNc7z++gng9bP/TmoxrrpqHK12A0kcQUTgAp4lWBqkcM6j1a5DpDJ9kIjoorLMIh1mGA4zLA1SDAbDc7/lr8gJSj/1/7bKFIA4ie7LlrILCsD5sjTH68dP/J+f1eoJ2p0Gmo06avUYSRJDxEDk7JG6ruKzBukwg7MO7bEmzwogotLz3sNaB5s75NYizyyyLEeWWWRpjizLL2mwX4aL4/iJUefVUqlP+90P73/L5nZ8rX5/rZbAwyOKDOKoeqvonQc64w1U7G1BRBXnrIP3HiKy2oH9Evnnp3ubf28N/8C6qswMAABEUfSsze22tfr9aZoBALK1+gPKklqMLOWiQCIqq7WdrZUKTf8DQKVOhPFePqOdocySGgd/IqKVOEQHtDOMUuXmenc/+PjQOsdDgVZh4ooOLw0iIlqWvDzd23iDdopRqtynfZRER7UzlJEY4eBPRLQiX6npf6CCBcAg+oJ2hjLi0cBERCsTV63n/0AFC8C/vvqNB4t8/3JRsQAQEa3oR0e++9wL2iFGrXJrAABg7osHXs6z/Ne1c5RJZ6yFpFapTSFERKPywHRv053aIUatcjMAABAZ86h2hrKJ4kq+FYiI3rkKTv8DFS0Aprb4qTJf0bjeRATGVPKtQET0Ti1KMvgH7RBroZKf+v1+/60oio5r5yiLiMf/EhEtywNPdbvdRe0ca6GSBQAAxEhlzmtea6aCxxoTEY1ExU7/O1dlC4A3+IR2hrLgBUBERMuyxkQL2iHWSmULwM6d3e/HUfSWdo4yEBYAIqLlPN/tTv5EO8RaqWwBAAATm2e0M5QBFwASEV2oapf/nK/Sn/wmkU9rZygDEc4AEBFdwLiD2hHWUqULwI4dU4eNMUPtHIXHAkBEdL6Xut0t39cOsZYqXQAAIIqjI9oZio7jPxHRBSo9/Q8EUAAMzAPaGYiIqFzES+ULQOW/+3nvze6HHk+d89zsvoLxiTYiXgZERAQAEOD41MzGd1f9RNnKzwCIiIvi6BXtHEXmK/0WJyK6PB44UPXBHwigAACAmHifdoYiq/y7nIjocgQw/Q8EUgCsx2eMqX6bWzVOARARve302BXmsHaI9RBEAbj99q0nTWSOaecoKs85ACIiAIAHvjw5ObmknWM9BFEAAMAYc0g7Q1F5xwJARAQA8NXf/ve2YAqAE/PxADY9rIrnIwAiIgCw1uNJ7RDrJZgCsHPnttfiOPqpdo4icpwBICKCAP94882b3tDOsV6CKQAAIEa+pp2hiFgAiIgAV/HLf84XVAFIIPdpZygia612BCIidSL2gHaG9RRUAbj1jqmvmygKYnXn5XDWg6cBEFHgvjs9feO/a4dYT0EVAACII/NN7QzF439WAoiIwiSBTf8DARYAI3K/doYistZpRyAiUiPOBFcAgtsXx8uBltdo1tFs1bVjEBFpONad2fieEM7/P1dwMwAi4uIo+hftHEWT51wISEShki+FNvgDARYAAPAif6OdoWhsnnMdIBEFyUHmtDNoCO4RAAB472X3Q48PnfOJdpYiGZ9oI4r5ZISIwiHAD6ZmNl7PGYBAiIiP4ugF7RxFk2V8DEBEYfHAXIiDPxBoAQCAGObj2hmKJksz7QhEROvKi9mjnUFLsAWgf8fUQhSbN7VzFEmeWzheDEREwZCvzsz8/ivaKbQEWwAAIInjv9bOUDQ2zbUjEBGtD49PakfQFHQB6N+2bdZEZqido0iGfAxARGF45eh3nn1KO4SmoAuAiLgkiv5OO0eRZGkOz8cARFRxArlvdnY26CNQgy4AAGDqyR8bI1z+fo50yFkAIqq0Y50Js1s7hLbgC0C/f9OJpB4HeQjESoYsAERUYQL5s8nJyeBvhg2+AACAiQd3ci3Az9nc8mhgIqokAV4cpG98UTtHEbAAAOj3+2ktiT+hnaNIhsNUOwIR0cg5wT39fp/fcBDoUcAr2f3w/hM2t1dq5ygGwRW/0IEI3yJEVBEeT09v37RFO0ZRcAbgHEkjukU7Q3F4DJc4C0BElbHoTfRH2iGKhAXgHDt2TB2u1eND2jmKYmmQcksgEVWCF+yamZl8VTtHkbAAnOeVV49uj+PopHaOIvCeswBEVAn/PBye4DXw5+ED3mU8uueJ7tJg6YB2jiIQEUxcOQYuBSCiklqUyP5Wt3vjy9pBioYzAMvYcdvWg7VG7XPaOYrAe4+lQfDbZYmorLzcxcF/efxedxF7Hjn4vSzNbtDOUQQTV3ZgDPsiEZXKZ6d7m+7SDlFU/ES/iLg++J0oNqe1cxTB4AxnAYioPAT+hbiW3q2do8hYAC6i3++friXRFjES9IURAJCmObKMZ2cQUSn8t4W7devWrTzh9SJYAP4f/du6/9RoxH8gRoLfDzc4MwAQ/MtARAUmwFuRd9t6vRv/UztL0bEAXIL+B7qP1eLah7RzaLPWYbDIbYFEVFgDAbrbtm/5tnaQMmABuETvv2PbA41m/WOhL5tcWhrC8qIgIiqeXCA7pnqbntUOUhYsAJdhx23bdtXq8V8EvXnCA2dODwCeEEhExZEK8IFub+NB7SBlEvBItnr79izcnQ3T+5zzwb5+9XqCVqepHYOIaNHA3zzV2/yUdpCyCXYAe6f2PbLwwTRLP+99uCWg02kiqSfaMYgoXG96cVMzM1ue1w5SRnwEsErvv2Pbg3GjdmskJtfOouXMmSVYG/wOSSJSIMAPjLPv4+C/esF+ex2VfQ899mtWzAt5bq/SzqLBRAbjE20ILwsgovXztThN+1v7W3+sHaTM+Kk9AvPz8zWbNp9Jh9nvamfRkCQxOuMt7RhEFALB/WPj0V2Tk5PBzr6OCgvACO3bc/Av06X8T7z3wT1aqTdqaLUb2jGIqLp+JJCPdHsbH9MOUhUsACO2b9+hG1zqns6y/N3aWdZbq11HvVHXjkFEFSPAQmrzO2+55abj2lmqhAVgjTw6t/C5YZp+2Ae2VbA91kKtFmvHIKJqOCHwH+32Nu/RDlJFQQ1O623+kf3X5ZC/z7L8vaEcoS8CdDotxCwBRLR6OQRfiIfpn3Kh39phAVgH83u+fFOWDR/Oc3uNdpb1IRgbbyJOWAKI6PII8BULf3evt/lF7SxVxwKwjvbOHdpls/wea92Edpa1J+iMt5AkkXYQIioDkWc8/L0zM5ue1o4SChYABXvnFv7Q5fm9eW6v1c6ylkTOrglIOBNARMvzECw4Lx/r9TZ+XTtMaFgAFM3vfXI6t/mf2zR/r6vw1sH2WBO1Go8MJqKfEfmxOL/HCu7v9TZ9TztOqFgACmB+fr5ps+Y9Lncfyq29tooLBlutBurNmnYMItJjBTjsRO4fDt/Y3+/3U+1AoWMBKJjdf/vEL8dN/1Hn8l6W2+vgq3NfQ6NZR7PFcwKIAvITAQ4D/pDEjYNTU+/7qXYg+jkWgAKbnZ2Nb7jut3d68T3r/G96637JWlfqr9FJLUa70wKvDiCqHA+PVyHyTcB9C0aeO3r0uSOzs7O8Mayg+DFcMnNzC78Sw97qHH4DwK96yLXOuau9800PH8N78QV/hBBFBp2xFkxUmckNohAsARgAeBOCY3D4IcS/5gWvGef/LUdyZPv2yTe1Q9KlYwGoqL17n3pPlKG4y+8bcdpq1Ra1YxDRxWVZ7jmwExERERERERERERERERERERERERERERERERERERERERERERERERERERERERFdtv8BZg2EYeLNEccAAAAASUVORK5CYII='

  protected user : any
  protected userDB : any
  private authService = inject(AuthService)
  private databaseService = inject(DatabaseService)
  private auth = inject(Auth)
  private fb = inject(FormBuilder)
  formulario : FormGroup
  protected formVisible = false
  historiasClinicas : any[] = []
  especialidadesEnHistoriasClinicas : string[] = []
  historiasClinicasPorEspecialidad : any

  constructor(){
    //   this.formulario = this.fb.group({
    //   dias: ['', [Validators.required]],
    //   horario: ['', [Validators.required]]
    // })
    this.formulario = this.fb.group({
      lunes: new FormControl(false),
      martes: new FormControl(false),
      miercoles: new FormControl(false),
      jueves: new FormControl(false),
      viernes: new FormControl(false),
      sabado: new FormControl(false),
      // Agregar los controles de inicio y fin para cada día
      lunes_inicio: new FormControl(''),
      lunes_fin: new FormControl(''),
      martes_inicio: new FormControl(''),
      martes_fin: new FormControl(''),
      miercoles_inicio: new FormControl(''),
      miercoles_fin: new FormControl(''),
      jueves_inicio: new FormControl(''),
      jueves_fin: new FormControl(''),
      viernes_inicio: new FormControl(''),
      viernes_fin: new FormControl(''),
      sabado_inicio: new FormControl(''),
      sabado_fin: new FormControl('')
    });
  }

  ngOnInit(){
    onAuthStateChanged(this.auth, (user) => {
      this.toggleAllTimeInputs(false);
      if (user) {
        this.user = user
        this.databaseService.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
          const user = userDatabase.data()
          this.userDB = user
          console.log('a ver el user')
          console.log(this.userDB)
        })
        this.databaseService.traerHistoriasClinicas(user.uid).subscribe(historiasClinicas => {
          this.historiasClinicas = historiasClinicas
          console.log(historiasClinicas)

          this.especialidadesEnHistoriasClinicas = [
            ...new Set(historiasClinicas.map((historia : any) => historia.especialidad))
          ];

          this.historiasClinicasPorEspecialidad = this.especialidadesEnHistoriasClinicas.reduce((acc:any, especialidad:any) => {
            acc[especialidad] = historiasClinicas.filter((historia:any) => historia.especialidad === especialidad);
            return acc;
          }, {});

          console.log(this.especialidadesEnHistoriasClinicas);
          console.log(this.historiasClinicasPorEspecialidad);

        })
  
      } else {
        console.log('No hay usuario logeado');
        this.user = null
      }
    })

    
  }

  toggleTimeInputs(day: string): void {
    const daySelected = this.formulario.get(day)?.value;

    // Activa o desactiva los controles de inicio y fin según si el checkbox está marcado o no
    this.formulario.get(`${day}_inicio`)?.[daySelected ? 'enable' : 'disable']();
    this.formulario.get(`${day}_fin`)?.[daySelected ? 'enable' : 'disable']();
  }

  toggleAllTimeInputs(enable: boolean): void {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    days.forEach(day => {
      this.formulario.get(`${day}_inicio`)?.[enable ? 'enable' : 'disable']();
      this.formulario.get(`${day}_fin`)?.[enable ? 'enable' : 'disable']();
    });
  }

  setFullSchedule(day: string): void {
    // Definir horarios predeterminados
    const weekdayHours = { inicio: '08:00', fin: '19:00' };
    const saturdayHours = { inicio: '08:00', fin: '14:00' };

    // Seleccionar el horario según el día
    const hours = day === 'sabado' ? saturdayHours : weekdayHours;

    // Asignar los horarios a los controles de inicio y fin
    this.formulario.get(`${day}_inicio`)?.setValue(hours.inicio);
    this.formulario.get(`${day}_fin`)?.setValue(hours.fin);
  }

  cargarDisponibilidad(): void {
    const disponibilidad: { [key: string]: { inicio: string, fin: string } } = {};
  
    // Recorremos cada día y agregamos solo los días seleccionados con sus horarios
    ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'].forEach(day => {
      if (this.formulario.get(day)?.value) { // Verifica si el día está seleccionado
        disponibilidad[day] = {
          inicio: this.formulario.get(`${day}_inicio`)?.value,
          fin: this.formulario.get(`${day}_fin`)?.value
        };
      }
    });
  
    console.log("Disponibilidad cargada:", disponibilidad);
    this.databaseService.modificarDisponibilidad(this.user.uid, disponibilidad)

    Swal.fire('Disponibilidad cargada!')
    this.formVisible = false
    this.ngOnInit()
  }

  mostrarHorarios(){
    this.formVisible = true
  }

  cerrarFormulario(){
    this.formVisible = false
  }


  detallesTurno(historiaClinica : any){
    const datosDinamicos = historiaClinica.datosDinamicos.map(
      (dato: any) => `<b>${dato.clave}:</b> ${dato.valor}`
    ).join('<br>');
  
    Swal.fire({
      title: `<h2 style="color: #004a7c;">Detalles de la Historia Clínica</h2>`,
      html: `
        <div style="text-align: left; font-size: 16px; color: #333;">
          <p><b>Altura:</b> ${historiaClinica.altura} cm</p>
          <p><b>Peso:</b> ${historiaClinica.peso} kg</p>
          <p><b>Presión:</b> ${historiaClinica.presion}</p>
          <p><b>Temperatura:</b> ${historiaClinica.temperatura} °C</p>
          <p><b>Evaluación:</b> ${historiaClinica.evaluacion}</p>
          <p><b>Datos adicionales:</b></p>
          <p>${datosDinamicos || 'No hay datos adicionales disponibles'}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#004a7c', // Azul similar al de la página
      background: '#f4f8fb', // Fondo claro
      customClass: {
        popup: 'sweetalert-custom', // Estilo adicional si necesitas CSS personalizado
      }
    });

  }

  descargarTurno(historiaClinica : any){
    const doc = new jsPDF();

    const fecha = new Date(historiaClinica.fecha);
    const fechaFormateada = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(fecha);

    const titulo = 'Detalles del Turno';
    const subtitulo = `Fecha: ${fechaFormateada || 'Sin especificar'}`;
    const datosDinamicos = historiaClinica.datosDinamicos.map(
      (dato: any) => `${dato.clave}: ${dato.valor}`
    ).join('\n');
    

    const imgWidth = 40; // Ancho del logo
    const imgHeight = 40; // Altura del logo (mantén proporción)
    doc.addImage(this.logoBase64, 'PNG', 150, 10, imgWidth, imgHeight); // Ajusta posición

    // Títulos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(titulo, 10, 20); // Posición del título
    doc.setFontSize(17);
    doc.text(subtitulo, 10, 35); // Posición del subtítulo

    // Datos del turno
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Especialidad: ${historiaClinica.especialidad}`, 10, 50);
    doc.text(`Medico: ${historiaClinica.nombreMedico}`, 10, 57);
    doc.text(`Altura: ${historiaClinica.altura} cm`, 10, 64);
    doc.text(`Peso: ${historiaClinica.peso} kg`, 10, 71);
    doc.text(`Presión: ${historiaClinica.presion}`, 10, 78);
    doc.text(`Temperatura: ${historiaClinica.temperatura} °C`, 10, 85);
    doc.text(`Evaluación: ${historiaClinica.evaluacion}`, 10, 92);

    // Datos dinámicos
    doc.setFont('helvetica', 'italic');
    doc.text('Datos adicionales:', 10, 104);
    doc.text(datosDinamicos || 'No hay datos adicionales disponibles', 10, 112);

    // Guardar el PDF
    doc.save('detalles-turno.pdf');
  
  }

}
