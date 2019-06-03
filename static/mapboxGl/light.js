function highLightMaker(map, point, licenceplate, className) {
	var pos = [ point.lon, point.lat ]
	{
		var el = document.createElement('div')
		el.className = 'markerAnimation'
		var el1 = document.createElement('p')

		el.appendChild(el1)
		var el2 = document.createElement('span')
		el1.appendChild(el2)

		var marker0 = new mapboxgl.Marker(el).setLngLat(pos)
		marker0.id = licenceplate + '_maker0'
		marker0.source = licenceplate + '_maker0'
		this.marke0 = marker0
		//this.marke0.addTo(map);
	}
	{
		var e2 = document.createElement('div')
		e2.className = 'marker'
		var el1 = document.createElement('p')

		e2.appendChild(el1)
		var el2 = document.createElement('span')
		el1.appendChild(el2)

		var marker1 = new mapboxgl.Marker(e2).setLngLat(pos)
		marker1.id = licenceplate + '_maker1'
		marker1.source = licenceplate + '_maker1'
		this.maker1 = marker1
		this.maker1.addTo(map)
	}
	this.currentPos = pos
	this.id = licenceplate
	this.map = map
	this.pop = null

	return this
}
highLightMaker.prototype.setPoP = function(object) {
	this.pop = object
}
highLightMaker.prototype.setPos = function(pos) {
	this.marke0.setLngLat(pos)
	this.maker1.setLngLat(pos)
	this.currentPos = pos
	if (this.pop != null) {
		this.pop.setLngLat(pos)
	}
}

highLightMaker.prototype.light = function() {
	this.maker1.remove()
	this.marke0.addTo(this.map)
}

highLightMaker.prototype.ulight = function() {
	this.marke0.remove()
	this.maker1.addTo(this.map)
}

highLightMaker.prototype.show = function() {
	this.ulight()

	if (this.pop != null) {
		this.pop.addTo(this.map)
	}
}

highLightMaker.prototype.uShow = function() {
	this.marke0.remove()
	this.maker1.remove()

	if (this.pop != null) {
		this.pop.remove()
	}
}

highLightMaker.prototype.show_pop = function() {
	if (this.pop != null) {
		this.pop.addTo(this.map)
	}
}

highLightMaker.prototype.uShow_pop = function() {
	if (this.pop != null) {
		this.pop.remove()
	}
}
