let defineProperty = function (object, propName, propValue, propDefaultValue, propType) {
    object[propName] = typeof object[propName] === propType?
        object[propName] : propDefaultValue
    if (propType === 'string') {
        object[propName] = object[propName] === ''?
            propDefaultValue : object[propName]
    }
}

module.exports = defineProperty