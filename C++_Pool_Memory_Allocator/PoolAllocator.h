#pragma once

template<typename T, int size> class PoolAllocator
{
    union Node
    {
        T data;
        Node* pNext;
    };
    Node array[size];
    Node* firstFree;

public:
    //Initialize the pool
    PoolAllocator()
    {
        //TODO Part a
        firstFree = &array[0];
        for (int i = 0; i < size - 1; i++) {
            array[i].pNext = &array[i + 1];
        }
        array[size - 1].pNext = nullptr;
    }

    //Allocate an element from the Pool and return a pointer to it.
    //return nullptr if the there are no elements available
    T* Allocate()
    {
        //TODO Part b
        if (firstFree == nullptr) {
            return nullptr;
        }

        Node* temp = firstFree;
        firstFree = temp->pNext;
        temp->pNext = nullptr;
        return &temp->data;
    }

    //Release element "t" to the Pool.
    void Free(T* t)
    {
        //TODO Part c
        Node* node = reinterpret_cast<Node*>(t);
        node->pNext = firstFree;
        firstFree = node;
    }
};
