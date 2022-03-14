const person = {
  name: 'John Doe',
  age: 42,
  nationality: 'American'
}

const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    if (!obj[prop]) {
      console.log(
        `Hmm... This property doesn't seem to exist on the target object`
      )
    } else {
      console.log(`The value of ${prop} is ${Reflect.get(obj, prop)}`)
    }
  },
  set: (obj, prop, value) => {
    if (prop === 'age' && typeof value !== 'number') {
      console.log(`Sorry, you can only pass numberic values for age.`)
    } else if (
      prop === 'name' &&
      typeof value !== 'string' &&
      value.length < 2
    ) {
      console.log(`You need to provide a valid name.`)
    } else {
      console.log(`Changed ${prop} from ${obj[prop]} to ${value}`)
      return Reflect.set(obj, prop, value)
    }
  }
})

personProxy.name = 'Van'
personProxy.age = '18'
personProxy.nonExistProperty
personProxy.name
