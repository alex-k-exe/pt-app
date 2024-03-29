class Node<T> {
	value: T;
	next: Node<T> | null = null;

	constructor(value: T) {
		this.value = value;
	}
}

export class LinkedList<T> {
	head: Node<T> | null = null;

	add(value: T): void {
		const newNode = new Node(value);
		if (this.head) newNode.next = this.head;
		this.head = newNode;
	}

	/**
	 * @param predicate A function that checks if a Node satisfies a condition.
	 * @returns The first Node that satisfies the predicate
	 */
	find(predicate: (value: T) => boolean): Node<T> | null {
		let currentNode = this.head;
		while (currentNode !== null) {
			if (predicate(currentNode.value)) {
				return currentNode;
			}
			currentNode = currentNode.next;
		}
		return null;
	}

	/**
	 * Remove a Node
	 * @param predicate A function that checks if a Node satisfies a condition.
	 * @returns The removed Node
	 */
	remove(predicate: (value: T) => boolean): Node<T> | null {
		if (!this.head) return null;

		let currentNode = this.head;
		let previousNode = null;

		while (currentNode !== null) {
			if (predicate(currentNode.value)) {
				if (previousNode) {
					previousNode.next = currentNode.next;
				} else {
					this.head = currentNode.next;
				}
				return currentNode;
			}
			if (!currentNode.next) return null;
			previousNode = currentNode;
			currentNode = currentNode.next;
		}

		return null;
	}

	/**
	 * Set the value for a Node
	 * @param predicate A function that checks if a Node satisfies a condition.
	 * @param newValue The new value
	 * @returns The old value
	 */
	modify(predicate: (value: T) => boolean, newValue: T): T | null {
		const foundNode = this.find(predicate);
		if (!foundNode) return null;

		const oldValue = foundNode.value;
		foundNode.value = newValue;
		return oldValue;
	}

	/**
	 * @returns Array of the elements in the LinkedList
	 */
	getArray() {
		const arr: Node<T>[] = [];

		let currentNode = this.head;
		while (currentNode !== null) {
			arr.push(currentNode);
			if (!currentNode.next) return arr;
			currentNode = currentNode.next;
		}

		return arr;
	}
}

export interface GoogleResponse {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}
