Ext.define('Components.ObjectBrowser', {
    
	extend: 'Ext.tree.Panel',
	alias:	'widget.objectbrowser',
	
	initComponent: function () {
    		Ext.apply(this, {
			forceFit: true,
			useArrows: true,
			rootVisible: false,
			multiSelect: true,
			columns: [{
				xtype: 'treecolumn',
				text: 'Key',
				sortable: true,
				dataIndex: 'key',
				flex: 2
			}, {
				text: 'Value',
				sortable: true,
				dataIndex: 'value'
			}]
		});
    	
		this.store = this.createStore(this.data);
		Components.ObjectBrowser.superclass.initComponent.apply(this, arguments);
	},
    
	createStore: function (data) {
		Ext.define(this.id + '-Objects', {
			extend: 'Ext.data.Model',
			fields: [{
				name: 'key',
				type: 'string'
			}, {
				name: 'value',
				type: 'string'
			}]
		});

    		var o = { text: 'root' };
    		o.children = this.parseObject(data);
    	
		var store = Ext.create('Ext.data.TreeStore', {
        		folderSort: true,
			model: this.id + '-Objects',
			proxy: {
				type: 'memory',
				data: o
			}
		});
		return store;
	},

	parseObject: function (o) {
		var items = [];

		if (o.hasOwnProperty('length') && (typeof o === 'object')) {
			var idx = o.length;
			while (idx--) {
				if (typeof o[idx] === 'object') {
					items.push({
						key: '[' + idx + ']',
						value: '',
						iconCls: 'tree-node-' + this.findType(o[idx]),
						children: this.parseObject(o[idx])
					});
				} else {
					items.push({
						key: '[' + idx + ']',
						value: o[idx],
						leaf: true,
						iconCls: 'tree-node-' + this.findType(o[idx])
					});
				}
			}
		}
		else if (!o.hasOwnProperty('length') && (typeof o === 'object')) {
			for (var key in o) {
				if (o.hasOwnProperty(key)) {
					if (typeof o[key] === 'object') {
						items.push({
							key: key,
							value: '',
							iconCls: 'tree-node-' + this.findType(o[key]),
							children: this.parseObject(o[key])
						});
					} else {
						items.push({
							key: key,
							value: o[key],
							leaf: true,
							iconCls: 'tree-node-' + this.findType(o[key]),
						});
					}
				}
			}
		}

		return items;
	},

	findType: function (o) {
		if (typeof o === 'object') {
			if (o.hasOwnProperty('length')) {
				return 'array';
			} else {
				return 'object';
			}
		} else {
			return typeof o;
		}
	}
});
