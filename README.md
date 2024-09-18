# Nexus Saver

This package lets you manage variables that you want to save and load.

## Install : 

To include Nexus Saver in your project, you can install it using npm :
```bash
npm i @arffornia/nexus_saver
```

## Usage : 

#### Init 
At the beginning, you must initialize an instance of NexusSaver with the path of the save file :

```typescript
const saver = new NexusSaver(savedFilePath);
```

#### Save a variable : 
You can easily save a variable like this : 

```typescript
saver.save("key", "value");
```

Nb: If you set a variable that already exists, it will simply overwrite it.

#### Load a variable :
You can easily load a variable like this :

```typescript 
saver.load("key");
```

Nb: If the key doesn't exist, it will return an empty string.

#### Delete a variable :
You can easily delete a variable using its key with :

```typescript
saver.delete("key");
```

Nb: If you try to delete a key that doesn't exist, nothing will happen.

## Tests

Tests are managed by **Jest** 

You can run the tests using :

```bash
npm test
```

## License

This project is licensed under the MIT licence. You can consult the complete text of the licence in the file [LICENSE](LICENSE).



