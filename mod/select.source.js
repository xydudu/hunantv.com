//11.17/2010 xydudu
//两级联动
//
//provinces = [
//  {id: 1, name: '湖南'}, {id: 2, name: '湖北'}
//];
//
//citys = [
//  {id: 1, pid: 1, name: '长沙'}, 
//  {id: 2, pid: 1, name: '某地'}
//];
window.HN && (HN.selectTwo = function($area, $default, $elems) {

    var 
    prov = document.getElementById($elems[0]),
    city = document.getElementById($elems[1]),
    p = $area[0],
    c = $area[1],
    des = prov.options[0] && [prov.options[0].value, city.options[0].value];

	prov.setAttribute('initLength', prov.options.length);
	city.setAttribute('initLength', city.options.length);
     
    fillSelect(prov, p, $default ? $default.pid : false, des && des[0]);
    $default && fillSelect(city, getCitys($default.pid), $default.id);

    prov.onchange = function($e) {
        var pid = this.value;
        fillSelect(city, getCitys(pid), false);
    }; 
    
    function fillSelect($elem, $data, $default, $des) {
        
        $elem.length = parseInt($elem.getAttribute('initLength')); //0;
        $des && ($elem.options[0] = new Option($des));
        for (var i = 0, l = $data.length; i < l; i ++) {
            var o = document.createElement('option');
            o.text = $data[i]['name'];
            o.value = $data[i]['id'];

            try {
                $elem.add(o, null);
            } catch(ex) {
                $elem.add(o);
            }
            
        }

        if ($default) {
			$elem.value = $default;
        } else {
			$elem.selectedIndex = 0;
		}
    }
    
    function getCitys($pid) {
        var citys = [];
        
        for (var i = 0, l = c.length; i < l; i++) {
            (c[i].pid == $pid) && citys.push(c[i]);
        }
        return citys;
    }
    
    return {
        
        set: function($city) {
            fillSelect(prov, p, $city.pid);
            fillSelect(city, getCitys($city.pid), $city.id);
        }
        
    };
});
